//ProductPage.jsx
import styles from './ProdutcPage.module.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MenuItem, Select, FormControl, InputLabel, Checkbox, FormGroup, FormControlLabel, Slider, Typography } from '@mui/material';
import Products from './products/Products';
export default function ProdutcPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const anoQuery = queryParams.get('ano');
    const tipoQuery = queryParams.get('tipo');

    // Estados visuais
    const [maxPrice, setMaxPrice] = useState(1000)
    const [minPrice, setMinPrice] = useState(0)
    const [value, setValue] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [anoLancamento, setAnoLancamento] = useState('');

    // Estados aplicados
    const [appliedMaxPrice, setAppliedMaxPrice] = useState(1000);
    const [appliedMinPrice, setAppliedMinPrice] = useState(0);
    const [appliedValue, setAppliedValue] = useState('');
    const [appliedSelectedTypes, setAppliedSelectedTypes] = useState([]);
    const [appliedAnoLancamento, setAppliedAnoLancamento] = useState('');

    useEffect(() => {
        if (anoQuery && !isNaN(anoQuery)) {
            setAnoLancamento(anoQuery);
            setAppliedAnoLancamento(anoQuery)
        }
        if (tipoQuery === 'selecao') {
            setSelectedTypes(['selecao']);
            setAppliedSelectedTypes(['selecao']);
        }
    }, [anoQuery, tipoQuery])


    const handleTypeChange = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(item => item !== type)
                : [...prev, type]
        );
    };

    // Formatar valor em reais
    const formatCurrency = (value) =>
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleApplyFilters = () => {
        setAppliedMinPrice(minPrice);
        setAppliedMaxPrice(maxPrice);
        setAppliedValue(value);
        setAppliedSelectedTypes(selectedTypes);

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
                                    onChange={() => handleTypeChange('selecao')}
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
                <div>
                    <Typography gutterBottom>Ano de Lançamento:</Typography>
                    <input
                        type="number"
                        min={1900}
                        max={2030}
                        maxLength={4}
                        value={anoLancamento}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (/^\d{0,4}$/.test(val) && val <= 2030 && val >= 1900)) {
                                setAnoLancamento(val);
                            }
                        }}
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
            />
        </main>
    )
}