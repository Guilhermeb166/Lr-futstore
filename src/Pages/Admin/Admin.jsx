import { useState } from "react";
import styles from "./Admin.module.css";
import { adicionarCamisa } from "../../backend/camisaService";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

export default function Admin() {

    const [tipo, setTipo] = useState("");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem("");
    
        const camisa = { tipo, nome, tamanhos, preco, clube, paisOrigem, selecao, anoLancamento,imagem };
        
        try {
          if (!imagem.startsWith("http")) throw new Error("Insira uma URL válida da imagem.");
          await adicionarCamisa(camisa);
          setMensagem("Camisa adicionada com sucesso!");
          setTipo("");
          setNome("");
          setTamanhos([]);
          setPreco("");
          setClube("");
          setPaisOrigem("");
          setSelecao("");
          setAnoLancamento("");
          setImagem("")
        } catch (error) {
          console.error("Erro ao adicionar camisa:", error.message || error);
          setMensagem(`Erro: ${error.message || "Erro ao adicionar camisa."}`);
        } finally {
          setLoading(false);
        }
      };

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
            required
                    />
          </div>
          <div>
          <FormControl fullWidth variant="standard" sx={{ mt: 0, mb: 0 }}>
            <InputLabel id="tipo-label" sx={{
              color: "black",
              "&.Mui-focused": {
                color: "black", // quando focado
              },
            }}>Tipo de Camisa</InputLabel>
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

          </div>
          <div>
            <label>Nome da Camisa:</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div>
            <label>Tamanhos Disponíveis:</label>
            <input type="text" placeholder="Ex: P, M, G" value={tamanhos.join(", ")} onChange={(e) => setTamanhos(e.target.value.split(", "))} required />
          </div>
          <div>
            <label>Preço:</label>
            <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} required />
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
                <input type="text" value={selecao} onChange={(e) => setSelecao(e.target.value)} required />
              </div>
          ) : null}
          {tipo === "retro" ? (
              <div>
                <label>Ano de Lançamento:</label>
                <input type="number" value={anoLancamento} onChange={(e) => setAnoLancamento(e.target.value)} required />
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


