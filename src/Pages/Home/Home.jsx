import Cards from './Cards/Cards'
import Carousel from './Carousel/Carousel'
import styles from './Home.module.css'
import { useEffect,useState } from 'react'
import { collection,query,orderBy,onSnapshot } from 'firebase/firestore'
import {db} from '../../backend/firebase'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Home(){
    const [camisasRecentes, setCamisasRecentes] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        const camisasRef = collection(db,"camisas")

        //busca as camisas mais recentes
        const q = query(camisasRef,orderBy("createdAt", "desc"))

        const unsubscribe = onSnapshot(q,(snapshot)=>{
            const lista = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data(),
            }))
            setCamisasRecentes(lista)
            setLoading(false)
        })
        return()=>unsubscribe()
    },[])
    
    return(
        <main className={styles.home}>
            <Carousel/>
            {loading?(<p>
                <AiOutlineLoading3Quarters className={styles.loadingIcon}/>
            </p>):(
                <div>
                    <section className={`${styles.lancamentos} ${styles.lancamentosTailandesas}`}>
                        <h2>Lançamentos Tailandesas</h2>
                        <Cards camisas={camisasRecentes.filter(camisa => camisa.tipo === 'clube' || camisa.tipo === 'selecao').slice(0,3)} />
                    </section>
                    <section className={`${styles.lancamentos} ${styles.lancamentosRetro}`}>
                        <img src="./img/mini-banner-retro.webp" alt="poster retros" />
                        <h2>Lançamentos Retrô</h2>
                        <Cards camisas={camisasRecentes.filter(camisa => camisa.tipo === 'retro').slice(0,3)}/>
                    </section>
                </div>
            )}
            
            
        </main>
    )
}