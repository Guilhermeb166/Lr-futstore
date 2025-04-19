import styles from './Cards.module.css'
import {db} from '../../../backend/firebase'
import { useEffect,useState } from 'react'
import { collection,query,orderBy,onSnapshot } from 'firebase/firestore'
export default function Cards(){
    const [camisas,setCamisas] = useState([])

    useEffect(()=>{
        const camisasRef = collection(db,"camisas")

        //busca as camisas mais recentes
        const q = query(camisasRef,orderBy("createdAt", "desc"))

        const unsubscribe = onSnapshot(q,(snapshot)=>{
            const lista = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data(),
            }))
            setCamisas(lista)
        })
        return()=>unsubscribe()
    },[])
    return(
        <section className={styles.lancamentosContainer}>
                <h2>Lançamentos</h2>
                <div className={styles.cardsLancamentos}>
                    {camisas.map((camisa)=>(
                        <div key={camisa.id} className={styles.card}>
                            <img src={camisa.image} alt={camisa.nome} />
                            <div>
                                <h3 className={styles.cardName}>{camisa.nome}</h3>
                                <p className={styles.cardPrice}>R$ {Number(camisa.preco).toFixed(2)}</p>
                            </div>

                        </div>
                    ))}
                    
                </div>
            </section>
    )
}