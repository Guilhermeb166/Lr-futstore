//individualProduct.jsx
import { useState, useEffect } from 'react';
import styles from './individualProduct.module.css'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../../Context/AppContext';
import { db, auth } from '../../../backend/firebase'
import { onAuthStateChanged } from 'firebase/auth';
import { MdDelete } from "react-icons/md";

export default function IndividualProduct() {
    const { addToCart } = useCart()
    const { id } = useParams();
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false)
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate()

    // campos de edição
    const [editNome, setEditNome] = useState("");
    const [editPreco, setEditPreco] = useState("");
    const [editTamanhos, setEditTamanhos] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            const ref = doc(db, 'camisas', id);

            const snapshot = await getDoc(ref);
            if (snapshot.exists()) {
                const data = { id: snapshot.id, ...snapshot.data() };
                setProduct(data);

                // preencher estados para edição
                setEditNome(data.nome);
                setEditPreco(data.preco);
                setEditTamanhos(data.tamanhos || []);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.email === process.env.REACT_APP_ADMIN_EMAIL) {
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            }
        })
        return () => unsubscribe()
    }, [])

    if (!product) return <main style={{ display: "flex", alignItems: "center" }}><p className={styles.loading}>Carregando...</p></main>

    //salvar alterações no Firestore
    const handleSaveEdit = async () => {
        try {
            const ref = doc(db, 'camisas', product.id);
            await updateDoc(ref, {
                nome: editNome,
                preco: Number(editPreco),
                tamanhos: editTamanhos
            });
            setProduct({ ...product, nome: editNome, preco: Number(editPreco), tamanhos: editTamanhos });
            setIsEditing(false);
            alert("Produto atualizado com sucesso!");
        } catch (err) {
            console.error("Erro ao atualizar:", err);
            alert("Erro ao salvar alterações.");
        }
    };

    return (
        <main className={styles.individualProduct}>
            <section className={styles.productDetailsLeft}>
                <div className={styles.ImageControl}>
                    <img src={product.image} alt={product.nome} className={styles.ImageProduct} />
                </div>
            </section>

            <p className={styles.divisoria}></p>

            <section className={styles.productDetailsRight}>
                {isAdmin && (
                    <div className={styles.btnControl}>
                        <button className={styles.deleteProductBtn}>Excluir Produto</button>
                        <button 
                            className={styles.editProductBtn} 
                            onClick={() => setIsEditing((prev) => !prev)}
                        >
                            {isEditing ? "Cancelar" : "Editar Produto"}
                        </button>
                    </div>
                )}
                {!isEditing ? (
                    <>
                        <div className={styles.titleWrapper}>
                            <h2 className={styles.TitleProduct}>{product.nome}</h2>
                        </div>
                        <p className={styles.priceProduct}>
                            {Number(product.preco).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}
                        </p>

                        <div className={styles.BtnList}>
                            {product.tamanhos.map((tamanho, index) => {
                                const isSelected = selectedSizes.includes(tamanho);
                                return (
                                    <label
                                        key={index}
                                        className={`${styles.btnSize} ${isSelected ? styles.selected : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedSizes((prev) =>
                                                isSelected
                                                    ? prev.filter((t) => t !== tamanho)
                                                    : [...prev, tamanho]
                                            );
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            name="tamanho"
                                            value={tamanho}
                                            checked={isSelected}
                                            readOnly
                                            style={{ display: 'none' }}
                                        />
                                        {tamanho}
                                    </label>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className={styles.editForm}>
                        <label>
                            Nome:
                            <input 
                                type="text" 
                                value={editNome} 
                                onChange={(e) => setEditNome(e.target.value)} 
                            />
                        </label>
                        <label>
                            Preço:
                            <input 
                                type="number" 
                                value={editPreco} 
                                onChange={(e) => setEditPreco(e.target.value)} 
                            />
                        </label>

                        <label className={styles.containerSizes}>
                            Tamanhos:
                            <div className={styles.sizeList}>
                                {editTamanhos.map((tamanho, i) => (
                                    <div key={i} className={styles.sizeItem}>
                                        <span>{tamanho}</span>
                                        <button 
                                            onClick={() => setEditTamanhos(editTamanhos.filter((_, idx) => idx !== i))}
                                        >
                                            <MdDelete className={styles.deleteIcon}/>
                                        </button>
                                    </div>
                                ))}
                                <button 
                                className={styles.addSize}
                                onClick={() => {
                                    const novo = prompt("Digite o novo tamanho:");
                                    if (novo && !editTamanhos.includes(novo)) {
                                        setEditTamanhos([...editTamanhos, novo]);
                                    }
                                }}>
                                    +
                                </button>
                            </div>
                        </label>

                        <button className={styles.saveBtn} onClick={handleSaveEdit}>
                            Salvar Alterações
                        </button>
                    </div>
                )}

                {!isEditing && (
                    <>
                        {selectedSizes.length > 0 && (
                            <div className={styles.quantityWrapper}>
                                {selectedSizes.map((size, index) => (
                                    <div key={index} className={styles.quantityInputGroup}>
                                        <label htmlFor={`quantity-${size}`}>Quantidade ({size}):</label>
                                        <input
                                            type="number"
                                            id={`quantity-${size}`}
                                            min="1"
                                            value={quantity[size] || 1}
                                            onChange={(e) =>
                                                setQuantity((prev) => ({
                                                    ...prev,
                                                    [size]: Number(e.target.value)
                                                }))
                                            }
                                            className={styles.quantityInput}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className={styles.DescritionProduct}>{product.descricao}</p>
                        <button
                            className={styles.FinshButton}
                            onClick={() => {
                                if (selectedSizes.length === 0) {
                                    alert("Selecione um tamanho antes de adicionar ao carrinho.");
                                    return;
                                }
                                selectedSizes.forEach((size) => {
                                    addToCart({
                                        id: product.id,
                                        nome: product.nome,
                                        image: product.image,
                                        preco: product.preco,
                                        tamanho: size,
                                        quantity: quantity[size] || 1
                                    });
                                });
                                navigate('/cart');
                            }}
                        > Adicionar ao Carrinho
                        </button>
                    </>
                    )}
            </section>
        </main>


    )
}