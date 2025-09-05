//cart.jsx
import styles from "./Cart.module.css";
import { useState } from "react";
import { useCart } from '../../Context/AppContext';
import { IoTrashOutline } from "react-icons/io5";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa";
import { FaTruck } from 'react-icons/fa';

export default function Cart() {
    const [opcaoEntrega, setOpcaoEntrega] = useState('retirada')
    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart()
    let [ cep,setCep] = useState('')
    const [nome,setNome] = useState('')
    const [endereco,setEndereco] = useState('')
    const [contato, setContato] = useState('');
    const [payment, setPayment] = useState('');

    const subtotal = cartItems.reduce((acc, item) => acc + item.preco * item.quantity, 0);

    const enviarPedido=()=>{

        if (opcaoEntrega === 'entrega') {
            if (!nome || !contato || !payment || !cep || !endereco) {
                alert('Por favor, preencha todos os campos para a entrega.');
                return;
            } else if (!nome.trim() || !contato.trim() || !payment.trim() || !cep.trim() || !endereco.trim()){
                alert('Preencha todos os campos corretamente.');
                return;
            }
        }

        const numberWhatsapp=process.env.REACT_APP_ADMIN_PHONE
        let mensagem = '*Novo pedido via website*%0A%0A'

        cartItems.forEach(item=>{
            mensagem += `• ${item.nome} (Tam: ${item.tamanho} - x${item.quantity}) - R$ ${(item.preco * item.quantity).toFixed(2)}%0A`
        })

        mensagem += `%0A*Subtotal:* R$ ${subtotal.toFixed(2)}%0A`
    

        if(opcaoEntrega==='entrega'){
            mensagem+= `%0A*Entrega solicitada*%0A`
            mensagem += `Nome: ${nome}%0A Contato: ${contato}%0A Forma de Pagamento: ${payment}%0A CEP: ${cep}%0A Endereço: ${endereco}%0A`;
        }else {
            mensagem += `%0A*Forma de entrega:* Retirada na loja`;
        }

        const url = `https://wa.me/${numberWhatsapp}?text=${mensagem}`;
        window.open(url, "_blank");
    }

    return (
        <main className={styles.cartPage}>
            {cartItems.length === 0 ? (
                <div className={styles.DivisionemptyText}>
                    <p className={styles.emptyText}>Seu carrinho está vazio.</p>
                </div>
            ) : (
                <>
                    <table className={styles.cartTable}>
                        <thead>
                            <th></th>
                            <th className={styles.TitleTable}>Produto</th>
                            <th className={styles.TitleTable}>Quantidade</th>
                            <th className={styles.TitleTable}>Preço</th>
                            <th></th>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id} className={styles.produtCell}>
                                    <td><img src={item.image} alt={item.nome} className={styles.productImage} />
                                    </td>
                                    <td>{item.nome} <br /> <small>Tam: {item.tamanho}</small></td>
                                    <td>
                                        <div className={styles.quantityControl}>
                                            <FaCaretLeft
                                                onClick={() => decreaseQuantity(item.id, item.tamanho)}
                                                className={styles.quantityIcon}
                                            />

                                            <span>{item.quantity}</span>
                                            <FaCaretRight
                                                onClick={() => increaseQuantity(item.id, item.tamanho)}
                                                className={styles.quantityIcon}
                                            />
                                        </div>
                                    </td>
                                    <td>R$ {(item.preco * item.quantity).toFixed(2)}</td>
                                    <td><IoTrashOutline onClick={() => removeFromCart(item.id, item.tamanho)} className={styles.removeProductIcon} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={styles.orderDescription}>
                        <h2 className={styles.TitleDescriptionResun}>Resumo do Pedido</h2>
                        <select
                            className={styles.opcaoEntregaSelect}
                            value={opcaoEntrega}
                            onChange={(e) => setOpcaoEntrega(e.target.value)}
                        >
                            <option value="retirada">Retirada</option>
                            <option value="entrega">Entrega</option>
                        </select>
                        {opcaoEntrega === 'entrega' ? (
                            <form className={styles.form}>
                                <div className={styles.FormDescrition}>
                                    <input
                                        className={styles.BarSeachrForm}
                                        type="text"
                                        placeholder="Informe seu Nome completo"
                                        value={nome}
                                        onChange={(e)=>setNome(e.target.value)}
                                    />
                                </div>
                                <div className={styles.FormDescrition}>
                                    <input
                                        className={styles.BarSeachrForm}
                                        type="text"
                                        inputMode=""
                                        placeholder="Informe seu Contato"
                                        value={contato}
                                        onChange={(e)=>setContato(e.target.value)}
                                    />
                                </div>
                                <div className={styles.FormDescrition}>
                                    <input
                                        className={styles.BarSeachrForm}
                                        type="payment"
                                        placeholder="Forma de Pagamento"
                                        value={payment}
                                        onChange={(e)=>setPayment(e.target.value)}
                                    />
                                </div>
                                <div className={styles.FormDescrition}>
                                    <input
                                        className={styles.BarSeachrForm}
                                        type="text"
                                        value={cep}
                                        placeholder="Informe seu CEP:"
                                        onChange={(e)=>{
                                            const numero = e.target.value.replace(/[^0-9-]/g, '')
                                            setCep(numero)
                                        }}
                                    />
                                </div>
                                <div className={styles.FormDescrition}>
                                    <input
                                        className={styles.BarSeachrForm}
                                        type="text"
                                        value={endereco}
                                        placeholder="Informe seu Endereço:"
                                        onChange={(e)=>setEndereco(e.target.value)}

                                    />
                                </div>
                            </form>
                        ) : (
                            <aside>
                                <p>Retirada</p>
                            </aside>
                        )}

                        <div className={styles.subtotalControl}>
                            <h2 className={styles.TitleDescription}>Subtotal: R$ {subtotal.toFixed(2)}</h2>
                            <button className={styles.sendRequest} onClick={enviarPedido}>Enviar Pedido <FaTruck className={styles.truckIcon} /></button>
                            <p>O pedido é enviado para o whatsapp</p>
                        </div>

                    </div>
                </>
            )}
        </main>

    )
}