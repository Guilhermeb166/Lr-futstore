import styles from './TalkToUs.module.css'
import { useState } from 'react'
import { BsInstagram } from "react-icons/bs";
export default function TalkToUs() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [charAmout, setCharAmout] = useState('')
    const handleSubmit = () => {
        console.log('email enviado');

    }
    const handleChange = (e) => {
        setCharAmout(e.target.value.length)
    }

    return (
        <main className={styles.contactPage}>
      
            <section className={styles.contactContainer}>
                <div className={styles.socialMedia}>
                    <h2>Redes Sociais</h2>
                    <div>
                        <BsInstagram className={styles.socialIcon}/>
                    </div>
                </div>
                <p className={styles.divider}></p>
                <form onSubmit={handleSubmit} className={styles.emailForm}>
                    <div className={styles.email}>
                        <label htmlFor="email">Digite seu Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className={`${styles.input} ${styles.inputEmail}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete='off'
                        />
                    </div>
                    <div className={styles.message}>
                        <label htmlFor="message">Digite sua mensagem:</label>
                        <div>
                            <textarea
                                id='message'
                                className={`${styles.input} ${styles.inputMessage}`}
                                maxLength="250"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value)
                                    handleChange(e)
                                }}

                            />
                            <span>{charAmout}/250</span>
                        </div>
                    </div>
                    <button type='submit'>Enviar</button>
                </form>

            </section>
        </main>
    )
}