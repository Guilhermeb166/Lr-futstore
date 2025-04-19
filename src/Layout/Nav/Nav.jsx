import styles from './Nav.module.css'
import { FaChevronDown } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
export default function Nav(){
    const navigate = useNavigate()
    return(
        <nav className={styles.navbar}>
             <ul className={styles.navList}>
                <li className={styles.linksNav} onClick={() => navigate('/')}>Home</li>
             
                <li className={styles.navItem}>
                    Camisas Tailandesas <FaChevronDown/>
                    <ul className={styles.dropdown}>
                        <li>Clubes Temporada 24/25</li>
                        <li> Clubes Temporada 23/24</li>
                        <li>Seleções </li>
                    </ul>
                </li>

                <li className={styles.navItem}>
                    Retrôs <FaChevronDown/>
                    <ul className={styles.dropdown}>
                        <li>Europeus</li>
                        <li>Brasileiros</li>
                        <li>Seleções</li>
                    </ul>
                </li>
                <li className={styles.linksNav}>Fale Conosco</li>
            </ul>
        </nav>
    )
}