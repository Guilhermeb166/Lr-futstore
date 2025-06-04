//individualProduct.jsx
import { useState, useEffect } from 'react';
import styles from './individualProduct.module.css'
import { doc, getDoc, } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../../../backend/firebase'
export default function IndividualProduct() {
    const { id } = useParams();
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
                <img src={product.image} alt={product.nome} />
            </section>
            <section className={styles.productDetailsRight}>

            </section>
        </main>

           
    )
}