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
    const [selectedSize, setSelectedSize] = useState("");
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
    if (!product) return <p>Carregando...</p>;
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
                <p className={styles.DescritionProduct}>{product.descricao}</p>
                <div className={styles.BtnList}>
                    {product.tamanhos.map((tamanho, index) => (
                        <label
                            key={index}
                            className={`${styles.btnSize} ${selectedSize === tamanho ? styles.selected : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedSize((prev) => (prev === tamanho ? '' : tamanho));
                            }}
                        >
                            <input
                                type="radio"
                                name="tamanho"
                                value={tamanho}
                                checked={selectedSize === tamanho}
                                readOnly
                                style={{ display: 'none' }}
                            />
                            {tamanho}
                        </label>
                    ))}
                </div>
                {selectedSize && (
                    <div className={styles.quantityWrapper}>
                        <label htmlFor="quantity">Quantidade:</label>
                        <input
                        type="number"
                        id="quantity"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className={styles.quantityInput}
                        />
                    </div>
                )}




                <p className={styles.priceProduct}>{Number(product.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}
                </p>
                <button className={styles.FinshButton}
                onClick={()=> {
                    if (!selectedSize) {
                        alert("Selecione um tamanho antes de adicionar ao carrinho.");
                        return;
                    }
                    addToCart({
                        id: product.id,
                        nome: product.nome,
                        image: product.image,
                        preco: product.preco,
                        tamanho: selectedSize,
                        quantity: quantity
                    });
                    navigate('/cart')
                }}>Adicionar o Carrinho</button>
            </section>
        </main>


    )
}