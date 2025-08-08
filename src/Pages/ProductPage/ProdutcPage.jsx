//ProductPage.jsx
import styles from './ProdutcPage.module.css'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // serve para pegar a URL atual e os dados que foram passados pra essa página.
import { MenuItem, Select, FormControl, InputLabel, Checkbox, FormGroup, FormControlLabel, Slider, Typography } from '@mui/material';
import Products from './products/Products';

export default function ProdutcPage() {

    const location = useLocation();//Pega informações da URL (como filtros que vieram de outra página) e deixa guardado na variável location.
    const navigate = useNavigate()
    // Estados visuais
    const [maxPrice, setMaxPrice] = useState(1000)
    const [minPrice, setMinPrice] = useState(0)
    const [value, setValue] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [anoLancamento, setAnoLancamento] = useState('');
    const [selectedVersoes, setSelectedVersoes] = useState([]);

    // Estados aplicados(só mudam quando o botão “Filtrar” é clicado):
    const [appliedMaxPrice, setAppliedMaxPrice] = useState(1000);
    const [appliedMinPrice, setAppliedMinPrice] = useState(0);
    const [appliedValue, setAppliedValue] = useState('');
    const [appliedSelectedTypes, setAppliedSelectedTypes] = useState([]);
    const [appliedAnoLancamento, setAppliedAnoLancamento] = useState('');
    const [appliedSelectedVersoes, setAppliedSelectedVersoes] = useState([]);

    useEffect(() => {
    const queryParams = new URLSearchParams(location.search);//Cria um objeto para ler os parâmetros da URL.
    const ano = location.state?.anoLancamento || queryParams.get('ano');//pega o anoLancamento que foi passado pela location.state,Se não tiver, pega da URL (queryParams.get('ano')).
    const tipo = location.state?.tipo || queryParams.get('tipo');
    const versao = location.state?.versao ||  queryParams.get('versao');
    //O operador ?. evita erro caso state seja undefined.
  
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

    setValue('');
    setMinPrice(0);
    setMaxPrice(1000);
    setAppliedMinPrice(0);
    setAppliedMaxPrice(1000);
    setAppliedValue('');
    /*Coloca os valores padrão nos filtros de preço e ordenação.
    O slider de preço começa em 0 até 1000.
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
    const formatCurrency = (value) =>
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });//Transforma um número normal em formato de dinheiro (ex: 1000 vira R$ 1.000,00).

    const handleApplyFilters = () => {
        setAppliedMinPrice(minPrice);
        setAppliedMaxPrice(maxPrice);
        setAppliedValue(value);
        setAppliedSelectedTypes(selectedTypes);
        setAppliedSelectedVersoes(selectedVersoes);

        // Validar ano antes de aplicar
        if (anoLancamento === '' || (anoLancamento >= 1900 && anoLancamento <= 2030)) {
            setAppliedAnoLancamento(anoLancamento);
        }
    };

    return (
        <main className={styles.ProdutcPage}>

            <section className={styles.filterControl}>
                <FormControl
                    sx={{
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: 'white',
                        height: '33px', // ajusta a altura aqui
                        display: 'flex',
                        marginBottom: '12px',
                        justifyContent: 'center', // centraliza o conteúdo verticalmente

                        '& .MuiOutlinedInput-root': {
                            height: '40px',
                            '& fieldset': {
                                borderColor: 'black',
                            },
                            '&:hover fieldset': {
                                borderColor: 'black',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'black',
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
                            backgroundColor: 'white',
                            color: 'black',
                            padding: '0px 8px', // padding reduzido aqui
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
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"crescente"}>Preço: Menor → Maior</MenuItem>
                        <MenuItem value={'descrescente'}>Preço: Maior → Menor</MenuItem>
                        <MenuItem value={"recentes"}>Mais Recentes</MenuItem>
                        <MenuItem value={"antigos"}>Mais Antigos</MenuItem>
                    </Select>
                </FormControl>
                <div className={styles.priceFilter}>
                    <Typography gutterBottom>Preço Mínimo: {formatCurrency(minPrice)}</Typography>
                    <Slider
                        value={minPrice}
                        min={0}
                        max={1000}
                        step={10}
                        onChange={(e, value) => {
                            if (value <= maxPrice) setMinPrice(value);
                        }}
                        valueLabelDisplay="auto"
                        sx={{
                            color: 'var(--laranja)',
                            '& .MuiSlider-thumb': {
                                width: 14,       // largura da bolinha
                                height: 13,      // altura da bolinha
                            },
                        }}
                    />

                    <Typography gutterBottom>Preço Máximo: {formatCurrency(maxPrice)}</Typography>
                    <Slider
                        value={maxPrice}
                        min={0}
                        max={1000}
                        step={10}
                        onChange={(e, value) => {
                            if (value >= minPrice) setMaxPrice(value);
                        }}
                        valueLabelDisplay="auto"
                        sx={{
                            color: 'var(--laranja)',
                            '& .MuiSlider-thumb': {
                                width: 14,       // largura da bolinha
                                height: 13,      // altura da bolinha
                            },
                        }}
                    />
                </div>
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
                                    checked={selectedTypes.includes('torcedor')}
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
                                    checked={selectedTypes.includes('jogador')}
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
                    variant="contained" className={styles.filterButton}>Filtrar</button>
            </section>
            <Products
                minPrice={appliedMinPrice}
                maxPrice={appliedMaxPrice}
                selectedTypes={appliedSelectedTypes}
                sortOrder={appliedValue}
                anoLancamento={appliedAnoLancamento}
                 selectedVersoes={appliedSelectedVersoes}
            />
        </main>
    )
}