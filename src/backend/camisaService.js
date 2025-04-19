import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
//serverTimestamp: salva a data e hora do servidor automaticamente. Isso é útil pra saber quando o item foi criado.
//addDoc: adicionar um novo documento (tipo uma "linha" da tabela)
//collection: escolher em qual coleção (tipo uma "tabela") vamos salvar os dados.

// Agora NÃO usamos mais Firebase Storage aqui
const adicionarCamisa = async (camisa) => {
  try {
    const camisaComImagem = {
      ...camisa,
      image: camisa.imagem, // mantém a URL como ela veio do formulário
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "camisas"), camisaComImagem);
    console.log("Camisa adicionada com sucesso! ID:", docRef.id);
  } catch (error) {
    console.error("Erro ao adicionar camisa:", error);
    throw error;
  }
};

export { adicionarCamisa };