//individualProduct.jsx
import { useState, useEffect } from 'react';
import styles from './individualProduct.module.css'
import { doc, getDoc, } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../../../backend/firebase'
export default function IndividualProduct() {
    const { id } = useParams();
    const [selectedSize, setSelectedSize] = useState("");
    const [product, setProduct] = useState(null);


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
                                e.preventDefault(); // evita comportamento nativo do label
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




                <p className={styles.priceProduct}>{Number(product.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}
                </p>
                <button className={styles.FinshButton}>Adicionar o Carrinho</button>
            </section>
        </main>


    )
}