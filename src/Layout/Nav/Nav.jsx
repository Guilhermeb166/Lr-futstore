//nav.jsx
import styles from './Nav.module.css'
import { useState, useEffect } from 'react';
import { FaChevronDown } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../backend/firebase";
export default function Nav() {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate()

    

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) =>{
            if(user && user.email === process.env.REACT_APP_ADMIN_EMAIL){
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            }
        })
        return () => unsubscribe()
    }, [])
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li className={styles.linksNav} onClick={() => navigate('/')}>Home</li>

                <li className={styles.navItem}>
                    Camisas Tailandesas <FaChevronDown />
                    <ul className={styles.dropdown}>
                        <li onClick={() => navigate('/', { state: {tipo: 'clube', anoLancamento: '2025' }})}>Clubes Temporada 25/26</li>
                        <li onClick={() =>  navigate('/', { state: {tipo: 'clube', anoLancamento: '2024' }})}>Clubes Temporada 24/25</li>
                        <li onClick={() => navigate('/', { state: { tipo: 'retro' }})}> Retrôs</li>
                        <li onClick={() =>  navigate('/', { state: { tipo: 'selecao' }})}>Seleções</li>
                        
                    </ul>
                </li>

                <li className={styles.navItem}>
                    Ceará e Fortaleza <FaChevronDown />
                    <ul className={styles.dropdown}>
                        <li onClick={() => navigate(`/?clube=${encodeURIComponent('Ceará')}`)}>Ceará</li>
                        <li onClick={() => navigate(`/?clube=${encodeURIComponent('Fortaleza')}`)}>Fortaleza</li>
                        
                    </ul>
                </li>
                <li className={styles.navItem}>
                    Versão da Camisa <FaChevronDown />
                    <ul className={styles.dropdown}>
                        <li onClick={() => navigate('/', { state: { versao: 'jogador' } })}>Versão Jogador</li>
                        <li onClick={() => navigate('/', { state: { versao: 'torcedor' } })}>Versão Torcedor</li>
                    </ul>
                </li>
                {/*<li className={styles.linksNav} onClick={() => { navigate('/contact') }}>Fale Conosco</li>*/}
                {isAdmin && (
                <li className={styles.linksNav} onClick={() => navigate('/admin')}>
                    Painel Admin
                </li>
                )}
            </ul>
        </nav>
    )
}