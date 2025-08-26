import { createContext, useContext, useState, useEffect } from "react";
/*
?createContext → cria um contexto que será usado para compartilhar informações.

?useContext → permite acessar esse contexto em outros componentes.

?useState → para criar estados (por exemplo, o estado do carrinho).

?useEffect → para fazer efeitos colaterais, como salvar ou carregar dados do localStorage.
*/
import {auth, db} from '../backend/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

const AuthContext = createContext();
//Aqui está sendo criado o contexto. Esse AuthContext é como uma "caixa" onde colocamos dados e funções que queremos compartilhar com outros componentes.
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);

    // Detecta usuário logado e verifica se passou mais de 1h
        useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collection(db, 'usuarios'), where('email', '==', user.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    setUsername(userData.username || null);
                }
                if (user.email === process.env.REACT_APP_ADMIN_EMAIL) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
                setIsAdmin(false);
                setUsername(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [])

    const value = {currentUser, isAdmin, username, loading};

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}