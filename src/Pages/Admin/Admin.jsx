//Admin.jsx
import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";
import { adicionarCamisa } from "../../backend/camisaService";
import { auth } from "../../backend/firebase";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

export default function Admin() {

    const [tipo, setTipo] = useState("");
    const [versao, setVersao] = useState("");
    const [nome, setNome] = useState("");
    const [tamanhos, setTamanhos] = useState([]);
    const [preco, setPreco] = useState("");
    const [clube, setClube] = useState("");
    const [paisOrigem, setPaisOrigem] = useState("");
    const [selecao, setSelecao] = useState("");
    const [anoLancamento, setAnoLancamento] = useState("");
    const [imagem, setImagem] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [descricao,setDescricao] =useState("")

    const navigate = useNavigate()

    useEffect(()=>{
      const unsubscribe = auth.onAuthStateChanged((user)=>{
        if(!user || user.email !== ADMIN_EMAIL){
          navigate("/")
        }
      })
      return () => unsubscribe()
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem("");

        const precoNumerico = preco
        .replace("R$ ", "")      // remove R$
        .replace(".", "")        // remove ponto dos milhares (se houver)
        .replace(",", ".");      // troca vírgula por ponto

        let imagemFinal = imagem.trim();

        // Se não termina em .jpeg, adiciona
        if (!imagemFinal.match(/\.(jpe?g)(\?.*)?$/i)) {
          imagemFinal += ".jpeg";
        }
        const camisa = { tipo, nome, tamanhos, preco: precoNumerico, clube, paisOrigem, selecao, anoLancamento,imagem: imagemFinal,descricao };
        
        try {
          if (!imagem.startsWith("http")) throw new Error("Insira uma URL válida da imagem.");
          await adicionarCamisa(camisa);
          setMensagem("Camisa adicionada com sucesso!");
          setTipo("")
          setVersao("")
          setNome("")
          setTamanhos([])
          setPreco("")
          setClube("")
          setPaisOrigem("")
          setSelecao("")
          setAnoLancamento("")
          setImagem("")
          setDescricao("")
        } catch (error) {
          console.error("Erro ao adicionar camisa:", error.message || error);
          setMensagem(`Erro: ${error.message || "Erro ao adicionar camisa."}`);
        } finally {
          setLoading(false);
        }
      };

      const formatarParaReal = (valor) =>{
        //remove tudo que não é número ou vírgula
        let numerico = valor.replace(/[^\d,]/g, "")

        /*Esse comando limpa tudo o que não é número ou vírgula.

        \d significa "dígitos" (ou seja, números).

        ^ e [] significam "qualquer coisa que não seja isso".
        
        Então isso remove letras, símbolos, espaços, "R$", etc.

        */

        //troca múltiplas vírgular por uma
        numerico = numerico.replace(/,+/g, ',')

        //se tiver vírgula, limita a 2 decimais
        if (numerico.includes(",")){
          const [inteiro,decimal] = numerico.split(",")
          numerico = inteiro + "," + decimal.slice(0,2)
        }

        //Remove zeros à esquerda
        numerico = numerico.replace(/^0+(?=\d)/,'')

        return `R$ ${numerico}`
      }

      const handlePrecoChange = (e) =>{
        const valorFormatado = formatarParaReal(e.target.value)
        setPreco(valorFormatado)
      }

  return (
    <main className={styles.adminPage}>
      <form className={styles.formAdmin} onSubmit={handleSubmit}>
          <div>
            <label>URL da Imagem da Camisa:</label>
            <input
            type="text"
            placeholder="https://..."
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
            required/>
          </div>
          <div>
          <FormControl fullWidth variant="standard" sx={{ mt: 0, mb: 0 }}>
            <InputLabel id="tipo-label" sx={{
              color: "black",
              "&.Mui-focused": {
                color: "black", // quando focado
              },
            }} required>Selecione o Tipo de Camisa</InputLabel>
            <Select
              labelId="tipo-label"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              label="Tipo de Camisa"
              sx={{
                color: "#000",
                borderBottom: "1px solid #000",
                '& .MuiSvgIcon-root': { color: "#000" }, // ícone da seta
                '& .MuiSelect-select': {
                  paddingRight: "0px !important", // FORÇA o padding-right
                  paddingLeft: "0px", // opcional
                },
                '&::before': { borderBottom: "1px solid #000" },
                '&:hover:not(.Mui-disabled):before': { borderBottom: "1px solid #000" },
                '&:after': { borderBottom: "none" }, // ← remove linha no focus
                '&.MuiSelect-select':{padding:"0px !important"},
              }}
            >
              <MenuItem value=""><em>Selecione</em></MenuItem>
              <MenuItem value="clube">Clube</MenuItem>
              <MenuItem value="selecao">Seleção</MenuItem>
              <MenuItem value="retro">Retrô</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="standard" sx={{ mt: 2, mb: 0 }}>
            <InputLabel id="versao" sx={{
              color: "black",
              "&.Mui-focused": {
                color: "black", // quando focado
              },
            }}>
              Selecione a Versão da Camisa
            </InputLabel>
            <Select
              labelId="versao"
              value={versao}
              onChange={(e) => setVersao(e.target.value)}
              label="Versão da Camisa"
              sx={{
                color: "#000",
                borderBottom: "1px solid #000",
                '& .MuiSvgIcon-root': { color: "#000" }, // ícone da seta
                '& .MuiSelect-select': {
                  paddingRight: "0px !important", // FORÇA o padding-right
                  paddingLeft: "0px", // opcional
                },
                '&::before': { borderBottom: "1px solid #000" },
                '&:hover:not(.Mui-disabled):before': { borderBottom: "1px solid #000" },
                '&:after': { borderBottom: "none" }, // ← remove linha no focus
                '&.MuiSelect-select':{padding:"0px !important"},
              }}
            >
              <MenuItem value=""><em>Selecione</em></MenuItem>
              <MenuItem value="jogador">Versão Jogador</MenuItem>
              <MenuItem value="torcedor">Versão Torcedor</MenuItem>
              
            </Select>
          </FormControl>

          </div>
          <div>
            <label>Nome da Camisa:</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="EX: Manchester City Uniforme I 25/26"/>
          </div>
          <div>
            <label>Tamanhos Disponíveis:</label>
            <input type="text" placeholder="Ex: P, M, G" value={tamanhos.join(", ")} onChange={(e) => setTamanhos(e.target.value.split(", "))} required />
          </div>
          <div>
            <label>Descrição</label>
            <textarea value={descricao} onChange={(e)=> setDescricao(e.target.value)} placeholder="Descrição da camisa"
            maxLength={120}/>
          </div>
          <div>
            <label>Preço:</label>
            <input type="text" value={preco} onChange={handlePrecoChange} placeholder="R$ 0,00" required />
          </div>
          {tipo === "clube" || (tipo === "retro" && !selecao) ? (
              <>
                <div>
                  <label>Nome do Clube:</label>
                  <input type="text" value={clube} onChange={(e) => setClube(e.target.value)} required />
                </div>
                <div>
                  <label>País de Origem do Clube:</label>
                  <input type="text" value={paisOrigem} onChange={(e) => setPaisOrigem(e.target.value)} required />
                </div>
              </>
          ) : null}
          {tipo === "selecao" || (tipo === "retro" && !clube) ? (
              <div>
                <label>Seleção:</label>
                <input type="text" value={selecao} onChange={(e) => setSelecao(e.target.value)} required placeholder="Ex: Brasil"/>
              </div>
          ) : null}
          {tipo === "retro" || tipo === "selecao" || tipo === "clube" ? (
              <div>
                <label>Ano de Lançamento:</label>
                <input type="number" value={anoLancamento} onChange={(e) => setAnoLancamento(e.target.value)} required placeholder="Ex: 2025"/>
              </div>
          ) : null}
          <button className={styles.addShirt} type="submit" disabled={loading}>
              {loading ? "Adicionando..." : "Adicionar Camisa"}
          </button>
          {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
          </form>
    </main>
    );
};


