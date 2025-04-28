// AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
/*
?createContext → cria um contexto que será usado para compartilhar informações.

?useContext → permite acessar esse contexto em outros componentes.

?useState → para criar estados (por exemplo, o estado do carrinho).

?useEffect → para fazer efeitos colaterais, como salvar ou carregar dados do localStorage.
*/
const AppContext = createContext();
//&Aqui está sendo criado o contexto. Esse AppContext é como uma "caixa" onde colocamos dados e funções que queremos compartilhar com outros componentes.


export function AppProvider({ children }) {//Estamos criando um componente provedor (AppProvider) que vai envolver todos os outros componentes da aplicação e fornecer o contexto para eles.
//!O { children } representa todos os componentes filhos que estarão dentro do AppProvider.

    const [cartItems, setCartItems] = useState(() => {//?criando o estado cartItems, que é uma lista de itens no carrinho.
      
        const saved = localStorage.getItem("cartItems");
        return saved ? JSON.parse(saved) : [];
        /*
        ^Ele começa tentando buscar os dados do localStorage (armazenamento do navegador).

        ^Se encontrar (saved), ele transforma de volta em objeto com JSON.parse.

        ^Se não encontrar, começa com uma lista vazia [].
      */
    });

    useEffect(() => {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      //! Esse useEffect é executado sempre que o carrinho (cartItems) muda. Ele salva a nova lista de itens no localStorage, para manter os dados mesmo se o usuário atualizar a página.

    }, [cartItems]);

    const addToCart = (item) => {//!Essa função adiciona um item ao carrinho. Ela primeiro verifica se o item já está no carrinho (existingItem).
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === item.id);
        /*
          ? prevItems: é o valor atual do carrinho (antes de adicionar o novo item). É uma lista de objetos, onde cada objeto representa um produto no carrinho.

          ? .find(): é um método do JavaScript que procura o primeiro item de uma lista que atenda a uma condição.

          ? (i) => i.id === item.id: é uma função que verifica se o id do item que já está no carrinho (i.id) é igual ao id do novo item (item.id) que queremos adicionar.
        */
        
    
        if (existingItem) {//& Se já tem esse produto no carrinho, então vamos apenas aumentar a quantidade dele
          return prevItems.map((i) =>
            //! prevItems é o carrinho atual (antes de adicionar o novo item).
            //! .map() percorre todos os itens do carrinho e retorna uma nova lista modificada.

            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            /*
              ^ Para cada item i no carrinho:

              ^ Se o id dele for igual ao id do item que queremos adicionar, então:

              ^ Retorna uma cópia do item ({ ...i }) com a quantidade aumentada em 1.

              ^ Se o id não for igual, apenas retorna o item como ele está. 
            */
          );
        }
    
        return [...prevItems, { ...item, quantity: 1 }];
        /*prevItems - É o carrinho atual,

        //! ...prevItems
        Os ... (três pontinhos) são o operador spread, que significa:

        "Pegue todos os itens que já estão em prevItems e coloque aqui dentro da nova lista."

        //! { ...item, quantity: 1 }
        item é o produto que estamos tentando adicionar.

        { ...item } faz uma cópia do objeto do produto.

        Depois adicionamos quantity: 1, ou seja, definimos que esse produto vai entrar no carrinho com 1 unidade.
        */
        //? Se o item ainda não está no carrinho, ele é adicionado com quantity: 1.
      });
    };
    

    const removeFromCart = (id) => {
      setCartItems((prevItems) => {
        return prevItems
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0);
      });
    };

    const increaseQuantity = (productId) => {
      setCartItems(prevItems =>
          prevItems.map(item =>
              item.id === productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
          )
      );
  };
  
  const decreaseQuantity = (productId) => {
      setCartItems(prevItems =>
          prevItems.map(item =>
              item.id === productId
                  ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
                  : item
          )
      );
  };
  

    return (
        <AppContext.Provider value={{
          cartItems,
          addToCart,
          removeFromCart,
          increaseQuantity,
          decreaseQuantity,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useCart() {
    return useContext(AppContext);
}
