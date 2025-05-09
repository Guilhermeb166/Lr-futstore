import styles from './Login.module.css'
import { auth } from "../../backend/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
  } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const PREDEFINED_USER = {
    email: process.env.REACT_APP_ADMIN_EMAIL,
    password: process.env.REACT_APP_ADMIN_PASSWORD
  };
export default function Login(){
    const [email,setEmail] = useState("")
    const [ password,setPassword] = useState("")
    const [createAccount,setCreateAccount] = useState(false)
    const [showPassword,setShowPassword] = useState(false)
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Detecta usuário logado e verifica se passou mais de 1h
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        const loginTime = localStorage.getItem("loginTime");

        // Se tem usuário e loginTime
        if (user && loginTime) {
            const now = Date.now();
            const diff = now - parseInt(loginTime, 10);
            const oneHour = 60 * 60 * 1000;

            if (diff > oneHour) {
            await signOut(auth);
            localStorage.removeItem("loginTime");
            setCurrentUser(null);
            } else {
            setCurrentUser(user);
            }
        } else {
            setCurrentUser(null);
        }
        });

        return () => unsubscribe();
    }, []);   


    const handleLogin = async (e)=>{
        e.preventDefault()
        try{
            const userCredential = await signInWithEmailAndPassword(auth,email,password)
            const user = userCredential.user

            localStorage.setItem("loginTime", Date.now()); //  salva o horário do login

            //verifica se é o admin
            if(user.email === PREDEFINED_USER.email){
                navigate("/admin"); // Redireciona para Admin
            }else{
                navigate("/home"); // Redireciona para Home
            }
        }catch (error){
            alert("Erro ao fazer login: " + error.message)
        }
    }

    const handleRegister = async ()=>{
        try{
            await createUserWithEmailAndPassword(auth,email,password);
            alert("Usuário criado com sucesso!")
        }catch (error){
            alert("Erro ao criar usuário: " + error.message)
        }
    }

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem("loginTime");
        setCurrentUser(null);
      };

    const handleCreateAccount=()=>{
        setCreateAccount(!createAccount)
    }
    const handlePassword = () =>{
        setShowPassword(!showPassword)
    }
    return(
        <main className={styles.loginPage}>
            <section className={`${styles.section} ${styles.textWrapper}`}>
                <p className={styles.text}>
                    Bem-vindo à LR Futstore!
                    Aqui você encontra as melhores camisas tailandesas e retrô com qualidade premium e preço justo. Seja para colecionar ou torcer com estilo, temos o modelo ideal para você mostrar sua paixão pelo futebol!
                </p>
                <div>
                    <span>Usamos seu e-mail de forma 100% segura para:</span><br/>
                    <p>
                        Identificar seu perfil <br />
                        Notificar sobre pedidos <br />
                        Gerenciar seu histórico de compras <br />
                        Garantir mais segurança na compra
                    </p>
                </div>
            </section>
            <section className={`${styles.section} ${styles.formWrapper}`}>
                {currentUser ? (
                    <div className={styles.dadosPessoais}>
                        <h2 className={styles.title}>Seus Dados</h2>
                        <p className={styles.currentEmail}><strong>Seu email:</strong>{currentUser.email}</p>
                        <button className={styles.formBtn} onClick={handleLogout}>Sair da conta</button>
                    </div>
                ):
                createAccount?(
                    <form className={styles.formAccount} action="" onSubmit={handleRegister} >
                        <h2 className={styles.title}>Crie sua Conta</h2>
                        <div className={styles.inputWrapper}>
                            <input type="email" placeholder='Digite seu email...' onChange={(e)=> setEmail((e.target.value))} className={styles.input}/>
                            <div className={`${styles.passwordControl} ${styles.input}`}>
                                <input type={showPassword?'text':'password'} placeholder='Digite sua senha...'  onChange={(e)=> setPassword((e.target.value))} autoComplete='current-password'/>
                                {showPassword?<FaEye onClick={handlePassword}/>:<FaEyeSlash onClick={handlePassword}/>}
                            </div>
                        </div>
                
                        <button onClick={handleRegister} className={styles.formBtn}>Criar Conta</button>
                        <p onClick={handleCreateAccount} className={styles.changeForm}>Já tem conta criada?Clique aqui.</p>
                    </form>
                ):(
                    <form className={styles.formAccount} action="" onSubmit={handleLogin}>
                        <h2 className={styles.title}>Entre na sua Conta</h2>
                        <div className={styles.inputWrapper}>
                            <input type="email" placeholder='Digite seu email...' onChange={(e)=> setEmail((e.target.value))} className={styles.input} autoComplete='on'/>
                            <div className={`${styles.passwordControl} ${styles.input}`}>
                                <input type={showPassword?'text':'password'} placeholder='Digite sua senha...' onChange={(e)=> setPassword((e.target.value))} autoComplete='current-password'/>
                                {showPassword?<FaEye onClick={handlePassword} className={styles.iconPassword}/>:<FaEyeSlash onClick={handlePassword} className={styles.iconPassword}/>}
                            </div>
                        </div>
                        <button onClick={handleLogin} className={styles.formBtn}>Entrar</button>
                        <p onClick={handleCreateAccount} className={styles.changeForm}>Não tem uma conta?Clique aqui.</p>
                    </form>
                )}
            </section>
            
        </main>
    )
}