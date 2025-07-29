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
                        <li onClick={() =>  navigate('/products', { state: { anoLancamento: '2024' }})}>Clubes Temporada 24/25</li>
                        <li onClick={() => navigate('/products', { state: { anoLancamento: '2023' }})}> Clubes Temporada 23/24</li>
                        <li onClick={() => navigate('/products', { state: { tipo: 'selecao' } })}>Seleções </li>
                    </ul>
                </li>

                <li className={styles.navItem}>
                    Retrôs <FaChevronDown />
                    <ul className={styles.dropdown}>
                        <li>Europeus</li>
                        <li>Brasileiros</li>
                        <li>Seleções</li>
                    </ul>
                </li>
                <li className={styles.linksNav} onClick={() => { navigate('/contact') }}>Fale Conosco</li>
                {isAdmin && (
                <li className={styles.linksNav} onClick={() => navigate('/admin')}>
                    Painel Admin
                </li>
                )}
            </ul>
        </nav>
    )
}