//individualProduct.jsx
import { useState, useEffect } from 'react';
import styles from './individualProduct.module.css'
import { doc, getDoc, } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../Context/AppContext';
import { useParams } from 'react-router-dom';
import { db } from '../../../backend/firebase'
export default function IndividualProduct() {
    const {addToCart} = useCart()
    const { id } = useParams();
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProduct = async () => {
            const ref = doc(db, 'camisas', id);

            const snapshot = await getDoc(ref);
            if (snapshot.exists()) {
                setProduct({ id: snapshot.id, ...snapshot.data() });
            }
        };
        fetchProduct();
    }, [id]);
    if (!product) return <main style={{display:"flex", alignItems:"center"}}><p className={styles.loading}>Carregando...</p></main>;
    return (
        <main className={styles.individualProduct}>
            <section className={styles.productDetailsLeft}>
                <div className={styles.ImageControl}>
                    <img src={product.image} alt={product.nome} className={styles.ImageProduct} />
                </div>
            </section>
            <p className={styles.divisoria}></p>
            <section className={styles.productDetailsRight}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.TitleProduct}>{product.nome}</h2>
                    <span>Ano de lançamento:  {product.anoLancamento}</span>
                </div>
                 <p className={styles.priceProduct}>{Number(product.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}
                </p>
                
                <div className={styles.BtnList}>
                    {product.tamanhos.map((tamanho, index) => {
                        const isSelected = selectedSizes.includes(tamanho)
                        return (
                        
                        <label
                            key={index}
                            className={`${styles.btnSize} ${isSelected ? styles.selected : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedSizes((prev) =>
                                    isSelected
                                    ? prev.filter((t) => t !== tamanho) // Remove se já estiver selecionado
                                    : [...prev, tamanho] // Adiciona se não estiver
                                )
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
                        )
                    })}
                </div>
                {selectedSizes.length > 0 && (
                    <div className={styles.quantityWrapper}>
                        {selectedSizes.map((size, index)=>(
                        <div key={index} className={styles.quantityInputGroup}>
                            <label htmlFor={`quantity-${size}`}>Quantidade ({size}):</label>
                            <input
                            type="number"
                            id={`quantity[size]`}
                            min="1"
                            value={quantity[size] || 1}
                            onChange={(e) => 
                                setQuantity((prev) => ({
                                    ...prev,
                                    [size] : Number(e.target.value)
                                }))
                            }
                            className={styles.quantityInput}
                            />
                        </div>
                        ))}
                        
                    </div>
                )}




               <p className={styles.DescritionProduct}>{product.descricao}</p>
                <button className={styles.FinshButton}
                onClick={()=> {
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
                            quantity: quantity
                        });
                    });
                    navigate('/cart')
                }}>Adicionar o Carrinho</button>
            </section>
        </main>


    )
}