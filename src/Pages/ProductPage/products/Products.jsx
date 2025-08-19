//Products.jsx
import styles from './Products.module.css'
import { useState, useEffect } from 'react'
import { collection, getDocs, } from 'firebase/firestore';
//import { FaCartPlus } from "react-icons/fa";
//import { useCart } from '../../../Context/AppContext';
import { db } from '../../../backend/firebase'; // ajuste o caminho conforme seu projeto
import { useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Products({ minPrice, maxPrice, selectedTypes, sortOrder, anoLancamento, selectedVersoes, forcedClub   }) {
    const [products, setProducts] = useState([])
    //const { addToCart } = useCart()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(false);
            try {
                let q = collection(db, 'camisas')

                //primeiro pegamos todos os produtos
                const snapshot = await getDocs(q)
                let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                if (forcedClub && forcedClub.trim() !== '') {
                    const fc = forcedClub.trim().toLowerCase()
                    data = data.filter(prod => (prod.clube || '').toString().trim().toLowerCase() === fc)
                } else{
                    //filtros
                    data = data.filter(prod =>
                        Number(prod.preco) >= minPrice &&
                        Number(prod.preco) <= maxPrice &&
                        (
                            selectedTypes.length === 0 ||
                            selectedTypes.includes(prod.tipo) ||
                            (selectedTypes.includes('selecao') && prod.selecao?.trim?.() !== '') ||
                            (selectedTypes.includes('clube') && prod.clube?.trim?.() !== '')
                        ) && (
                            selectedVersoes.length === 0 ||
                            selectedVersoes.includes(prod.versao)
                        ) &&
                        (!anoLancamento || prod.anoLancamento === anoLancamento)
                    )
                }

                // Ordenação
                if (sortOrder === 'crescente') {
                    data.sort((a, b) => a.preco - b.preco)
                } else if (sortOrder === 'descrescente') {
                    data.sort((a, b) => b.preco - a.preco);
                } else if (sortOrder === 'recentes') {
                    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                } else if (sortOrder === 'antigos') {
                    data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                }

                setProducts(data)
            }catch (error) {
                console.error('Erro ao buscar produtos:', error);
                setProducts([]);
            } finally {
                setLoading(true);
            }
        }
        fetchProducts()

    }, [minPrice, maxPrice, selectedTypes, sortOrder, anoLancamento, forcedClub, selectedVersoes])
    return (
        <section className={styles.ProductsContainer}>
            {!loading ? (
                <AiOutlineLoading3Quarters className={styles.loading}/>
            ) : products.length === 0 ?(
                <p>Nenhum produto encontrado.</p>
            ) : (
                products.map(prod => (
                    <div key={prod.id} className={styles.productCard} onClick={() => navigate(`/individualProduct/${prod.id}`)}>
                        
                        <img src={prod.image} alt={prod.nome} />
                        <div>
                            <h3>{prod.nome}</h3>

                            <p>{Number(prod.preco).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 2
                            })}</p>
                        </div>
                    </div>
                ))
            )}
        </section>
    )
}