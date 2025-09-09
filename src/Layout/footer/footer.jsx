import { FaPhoneFlip } from 'react-icons/fa6'
import { MdOutlineMail } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import styles from './footer.module.css'
export default function Footer(){
    const navigate = useNavigate();

    return(
        <footer className={styles.footer}>
            <div className={styles.footerControl}>
                <ul className={styles.listFooter}>
                    <strong>Links</strong>
                    <li className={styles.linksFooter} onClick={() => navigate('/login')}>Minha Conta</li>
                    <li className={styles.linksFooter} onClick={() => navigate('/contact')}>Entre em contato</li>
                    <li className={styles.linksFooter}>Local da Loja</li>
                </ul>
                <span></span>
                <ul className={styles.listFooter}>
                    <strong>Contato</strong>
                    <li><FaPhoneFlip /> 85-00000-0000</li>
                    <li><MdOutlineMail/> lrfutstore@gmail.com  </li>
                </ul>
            </div>
            <p className={styles.copy}>&copy;  FUT STORE 2025 - Todos os direitos reservados. Conheça nossa política de privacidade</p>
        </footer>
    )
}