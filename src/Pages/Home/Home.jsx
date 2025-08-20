//ProductPage.jsx
import styles from './Home.module.css'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // serve para pegar a URL atual e os dados que foram passados pra essa página.
import { MenuItem, Select, FormControl, InputLabel, Checkbox, FormGroup, FormControlLabel, /*Slider,*/ Typography } from '@mui/material';
import Products from '../ProductPage/products/Products';
import { CiFilter } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

export default function ProdutcPage() {

    const location = useLocation();//Pega informações da URL (como filtros que vieram de outra página) e deixa guardado na variável location.
    const navigate = useNavigate()
    // Estados visuais
    const [maxPrice, setMaxPrice] = useState(200)
    const [minPrice, setMinPrice] = useState(0)
    const [value, setValue] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [anoLancamento, setAnoLancamento] = useState('');
    const [selectedVersoes, setSelectedVersoes] = useState([]);

    // Estados aplicados(só mudam quando o botão “Filtrar” é clicado):
    const [appliedMaxPrice, setAppliedMaxPrice] = useState(200);
    const [appliedMinPrice, setAppliedMinPrice] = useState(0);
    const [appliedValue, setAppliedValue] = useState('');
    const [appliedSelectedTypes, setAppliedSelectedTypes] = useState([]);
    const [appliedAnoLancamento, setAppliedAnoLancamento] = useState('');
    const [appliedSelectedVersoes, setAppliedSelectedVersoes] = useState([]);

    // filtro silencioso vindo da URL (ex: ?clube=Fortaleza)
    const [silentClub, setSilentClub] = useState(''); // string do clube quando ativado

    const [showFilter, setShowFilter] = useState(false)
    const [productsCount, setProductsCount] = useState(0);
    

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);//Cria um objeto para ler os parâmetros da URL.
        const ano = location.state?.anoLancamento || queryParams.get('ano');//pega o anoLancamento que foi passado pela location.state,Se não tiver, pega da URL (queryParams.get('ano')).
        const tipo = location.state?.tipo || queryParams.get('tipo');
        const versao = location.state?.versao ||  queryParams.get('versao');
        //O operador ?. evita erro caso state seja undefined.
        const clubeRaw = queryParams.get('clube'); //pega clube da URL
    
        if (ano && !isNaN(ano)) {//verifica se o ano existe e se ele é um numero isNaN = "is Not a Number" 
            setAnoLancamento(ano);
            setAppliedAnoLancamento(ano);
            //Salva o ano tanto no campo editável(visual) quanto no filtro aplicado
        } else {
            setAnoLancamento('');
            setAppliedAnoLancamento('');
            //Se não tiver ano válido, deixa o campo vazio.
        }
        if (versao === 'jogador'){
                setSelectedVersoes(['jogador'])
                setAppliedSelectedVersoes(['jogador'])
        }else if (versao === 'torcedor'){
                setSelectedVersoes(['torcedor'])
                setAppliedSelectedVersoes(['torcedor']) 
        }else{
                setSelectedVersoes([])
                setAppliedSelectedVersoes([])
        }
        if (tipo === 'selecao') {
            setSelectedTypes(['selecao']);
            setAppliedSelectedTypes(['selecao']);
            //Se for “selecao”, aplica esse tipo.
        }else if (tipo === 'clube'){
            setSelectedTypes(['clube']);
            setAppliedSelectedTypes(['clube']);
        }else if (tipo=== 'retro'){
            setSelectedTypes(['retro']);
            setAppliedSelectedTypes(['retro']);
        } else {
            setSelectedTypes([]);
            setAppliedSelectedTypes([]);
        }

        // 🔹 Se vier "ceara" ou "fortaleza" na URL, aplica silenciosamente
        if (clubeRaw) {
                const trimmed = String(clubeRaw).trim();
                const lower = trimmed.toLowerCase();
                // aceita diferentes grafias / acentos
                if (lower === 'fortaleza' || lower === 'ceara' || lower === 'ceará') {
                    // guarda a string "amigável" (preservando capitalização mínima)
                    const normalized = trimmed.split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                        .join(' ');
                    setSilentClub(normalized); // ex: "Fortaleza" ou "Ceará"
                    // garantir que 'clube' esteja como tipo aplicado para compatibilidade
                    setAppliedSelectedTypes(prev => (prev.includes('clube') ? prev : [...prev, 'clube']));
                } else {
                    setSilentClub('');
                }
        } else {
            setSilentClub('');
        }

        setValue('');
        setMinPrice(0);
        setMaxPrice(200);
        setAppliedMinPrice(0);
        setAppliedMaxPrice(200);
        setAppliedValue('');
        /*Coloca os valores padrão nos filtros de preço e ordenação.
        O slider de preço começa em 0 até 200.
        setValue e setAppliedValue controlam a ordem (crescente ou decrescente) de preços, que aqui está zerada. */
    }, [location.search,location.state ]); //Isso diz: "Execute tudo isso sempre que a URL (location.search) ou o estado (location.state) mudar."

    

    const handleTypeChange = (type) => {//Quando o usuário clicar em um checkbox de tipo (clube, selecao, retro):Se já estava marcado, remove, e vice versa.
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(item => item !== type)
                : [...prev, type]
        );
    };

    const handleVersaoChange = (versao) => {
    setSelectedVersoes(prev =>
        prev.includes(versao)
            ? prev.filter(v => v !== versao)
            : [...prev, versao]
    );
};

    // Formatar valor em reais
   /* const formatCurrency = (value) =>
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });*///Transforma um número normal em formato de dinheiro (ex: 1000 vira R$ 1.000,00).

    useEffect(() => {
        setAppliedValue(value); // Aplica instantaneamente a ordenação quando value muda
    }, [value]);

    const handleApplyFilters = () => {
        setAppliedMinPrice(minPrice);
        setAppliedMaxPrice(maxPrice);
        
        setAppliedSelectedTypes(selectedTypes);
        setAppliedSelectedVersoes(selectedVersoes);

        // Validar ano antes de aplicar
        if (anoLancamento === '' || (anoLancamento >= 1900 && anoLancamento <= 2030)) {
            setAppliedAnoLancamento(anoLancamento);
        }

        // Se houver um filtro silencioso ativo, removemos ele agora:
        if (silentClub) {
            setSilentClub(''); // desativa o filtro silencioso interno
            // limpa a query string da URL (remove ?clube=...) para não reaplicar automaticamente
            navigate('/products', { replace: true });
        }
    };

    const handleFilter =()=>{
        setShowFilter(!showFilter)
    }

    return (
        <main className={styles.ProdutcPage}>
            
                <section className={`${styles.filterControl} ${showFilter ? styles.active : ''}`}>
                    <IoClose onClick={handleFilter} className={styles.closeFilterBtn}/>
                <p className={styles.horizontalLine}></p>
                <div className={styles.inputsFilter}>
                    <Typography gutterBottom>Tipo:</Typography>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedTypes.includes('retro')}
                                    onChange={() => handleTypeChange('retro')}
                                    sx={{
                                        color: '#666', // cor do checkbox quando desmarcado
                                        '&.Mui-checked': {
                                            color: 'var(--laranja)', // cor quando marcado (ex: azul MUI)
                                        },
                                    }}
                                />
                            }
                            label="Retrô"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedTypes.includes('selecao')}
                                    onChange={() => {
                                        handleTypeChange('selecao');
                                        
                                    }}
                                    sx={{
                                        color: '#666', // cor do checkbox quando desmarcado
                                        '&.Mui-checked': {
                                            color: 'var(--laranja)', // cor quando marcado (ex: azul MUI)
                                        },
                                    }}
                                />
                            }
                            label="Seleções Nacionais"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedTypes.includes('clube')}
                                    onChange={() => handleTypeChange('clube')}
                                    sx={{
                                        color: '#666', // cor do checkbox quando desmarcado
                                        '&.Mui-checked': {
                                            color: 'var(--laranja)', // cor quando marcado (ex: azul MUI)
                                        },
                                    }}
                                />
                            }
                            label="Clubes"
                        />
                    </FormGroup>

                </div>
                <p className={styles.horizontalLine}></p>
                <div className={styles.inputsFilter}>
                    <Typography gutterBottom>Versão:</Typography>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedVersoes.includes('torcedor')}
                                    onChange={()=> handleVersaoChange('torcedor')}
                                    sx={{
                                        color: '#666',
                                        '&.Mui-checked': {
                                            color: 'var(--laranja)', // cor quando marcado 
                                        },
                                    }}
                                    
                                />
                            }
                            label="Torcedor"
                        />
                         <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedVersoes.includes('jogador')}
                                    onChange={()=> handleVersaoChange('jogador')}
                                    sx={{
                                        color: '#666',
                                        '&.Mui-checked': {
                                            color: 'var(--laranja)', // cor quando marcado 
                                        },
                                    }}
                                    
                                />
                            }
                            label="Jogador"
                        />
                    </FormGroup>
                </div>
                <p className={styles.horizontalLine}></p>
                <div>
                    <Typography gutterBottom>Ano de Lançamento:</Typography>
                    <input
                        type="number"
                        min={1900}
                        max={2030}
                        maxLength={4}
                        value={anoLancamento}
                        onChange={(e) => setAnoLancamento(e.target.value)}
                        placeholder="Ex: 2024"
                        className={styles.anoInput}
                    />
                </div>
                <button onClick={handleApplyFilters}
                    variant="contained" className={styles.filterButton}>Aplicar Filtrar</button>
            </section>   
            
            <div className={styles.titlePage}>
                <h1>Todos os Produtos</h1>
                <p>Resultado: {productsCount} produtos encontrados</p>
            </div>
            <div className={styles.filterControls}>
                <FormControl
                    sx={{
                        width: '100%',
                        maxWidth: '400px',
                        boxShadow:'0 2px 6px rgba(0,0,0,0.2)',
                        color:'white',
                        height: '33px', // ajusta a altura aqui
                        display: 'flex',
                        borderRadius:"5px",
                        justifyContent: 'center', // centraliza o conteúdo verticalmente
                        
                        '& .MuiOutlinedInput-root': {
                            height: '40px',
                            borderRadius:"5px",
                            '& fieldset': {
                                borderColor: '#C7C7C7FF',
                                
                            },
                            '&:hover fieldset': {
                                borderColor: '#C7C7C7FF',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#C7C7C7FF',
                            },
                        },
                    }}>
                    <InputLabel id="select-label"
                        sx={{
                            color: 'black',
                            top: '-10px', // empurra o label pra cima, ajuste conforme necessário
                            '&.Mui-focused': {
                                color: 'black',
                                top: '0px'
                            },
                        }}>Ordenar por:</InputLabel>
                    <Select
                        labelId="select-label"
                        id="select"
                        value={value}
                        label="Ordenar por:"
                        onChange={(e) => setValue(e.target.value)}
                
                        sx={{
                            backgroundColor: '#F0F0F0',
                            color: 'black',
                            padding: '0px', // padding reduzido aqui
                            height: '40px', // ou ajuste manualmente a altura
                            
                            '& .MuiSvgIcon-root': {
                                color: 'black', // seta preta
                            },
                            '& .MuiSelect-select': {
                                padding: '0px 12px', // padding interno do texto
                                display: 'flex',
                                alignItems: 'center',
                            },
                        }}
                
                        MenuProps={{
                            PaperProps: {
                            sx: {
                                backgroundColor: '#333', // fundo do dropdown
                                color: 'white',          // cor do texto
                
                
                                '& .MuiMenuItem-root': {
                                color: 'white',
                                '&.Mui-selected': {
                                    backgroundColor: '#333',
                                },
                                '&:hover': {
                                    backgroundColor: '#222',
                                },
                                },
                            }}
                        }}
                        >
                        <MenuItem value="" sx={{
                            backgroundColor: "#333",
                            color: "white",
                            "&:hover": {
                            backgroundColor: "#222", // hover
                            },
                            "&.Mui-selected": {
                            backgroundColor: "#444 !important", // quando selecionado
                            color: "white",
                            },
                            "&.Mui-focusVisible": {
                            backgroundColor: "#444", // quando focado (ex: pelo teclado)
                            },
                            "&.Mui-active": {
                            backgroundColor: "#222", // quando clicado
                            },
                        }}>
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"crescente"} sx={{
                            backgroundColor: "#333",
                            color: "white",
                            "&:hover": {
                            backgroundColor: "#222", // hover
                            },
                            "&.Mui-selected": {
                            backgroundColor: "#444 !important", // quando selecionado
                            color: "white",
                            },
                            "&.Mui-focusVisible": {
                            backgroundColor: "#444", // quando focado (ex: pelo teclado)
                            },
                            "&.Mui-active": {
                            backgroundColor: "#222", // quando clicado
                            },
                        }}>Preço: Menor → Maior</MenuItem>
                        <MenuItem value={'descrescente'}sx={{
                            backgroundColor: "#333",
                            color: "white",
                            "&:hover": {
                            backgroundColor: "#222", // hover
                            },
                            "&.Mui-selected": {
                            backgroundColor: "#444 !important", // quando selecionado
                            color: "white",
                            },
                            "&.Mui-focusVisible": {
                            backgroundColor: "#444", // quando focado (ex: pelo teclado)
                            },
                            "&.Mui-active": {
                            backgroundColor: "#222", // quando clicado
                            },
                        }}>Preço: Maior → Menor</MenuItem>
                        <MenuItem value={"recentes"}sx={{
                            backgroundColor: "#333",
                            color: "white",
                            "&:hover": {
                            backgroundColor: "#222", // hover
                            },
                            "&.Mui-selected": {
                            backgroundColor: "#444 !important", // quando selecionado
                            color: "white",
                            },
                            "&.Mui-focusVisible": {
                            backgroundColor: "#444", // quando focado (ex: pelo teclado)
                            },
                            "&.Mui-active": {
                            backgroundColor: "#222", // quando clicado
                            },
                        }}>Mais Recentes</MenuItem>
                        <MenuItem value={"antigos"}sx={{
                            backgroundColor: "#333",
                            color: "white",
                            "&:hover": {
                            backgroundColor: "#222", // hover
                            },
                            "&.Mui-selected": {
                            backgroundColor: "#444 !important", // quando selecionado
                            color: "white",
                            },
                            "&.Mui-focusVisible": {
                            backgroundColor: "#444", // quando focado (ex: pelo teclado)
                            },
                            "&.Mui-active": {
                            backgroundColor: "#222", // quando clicado
                            },
                        }}>Mais Antigos</MenuItem>
                    </Select>
                </FormControl>
                {!showFilter && (
                    <button onClick={handleFilter}  className={styles.openFilterBtn}><CiFilter /></button>
                )}
            </div>
            <Products
                className={styles.products}
                minPrice={appliedMinPrice}
                maxPrice={appliedMaxPrice}
                selectedTypes={appliedSelectedTypes}
                sortOrder={appliedValue}
                anoLancamento={appliedAnoLancamento}
                selectedVersoes={appliedSelectedVersoes}
                forcedClub={silentClub}//  quando presente, Products mostrará só esse clube
                onProductsCountChange={setProductsCount} // Passa a função para atualizar a contagem
            />
        </main>
    )
}