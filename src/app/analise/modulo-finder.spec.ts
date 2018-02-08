import { Sistema } from '../sistema';
import { Modulo } from '../modulo';
import { ModuloDaFuncionalidadeFinder } from './modulo-finder';

describe('ModuloDaFuncionalidadeFinder', () => {

     const sistemaJSON = {
        'id': 1801,
        'sigla': 'json 2',
        'nome': 'Modulo e Funcionalidade @JsonManaged @JsonBack',
        'numeroOcorrencia': 'o',
        'organizacao': {
            'id': 1201,
            'nome': 'Exército Brasileiro',
            'cnpj': '75.185.273/0001-57',
            'ativo': true,
            'numeroOcorrencia': 'EB-1',
            'contracts': [
                {
                    'id': 1251,
                    'numeroContrato': 'c1',
                    'dataInicioVigencia': '2018-01-01',
                    'dataFimVigencia': '2018-01-31',
                    'manual': {
                        'id': 2951,
                        'nome': 'manual teste percentual',
                        'observacao': 'teste',
                        'valorVariacaoEstimada': 0.5,
                        'valorVariacaoIndicativa': 0.35,
                        'arquivoManualId': 2901,
                        'esforcoFases': [
                            {
                                'id': 3001,
                                'esforco': 0.25,
                                'fase': {
                                    'id': 954,
                                    'nome': 'Testes'
                                }
                            },
                            {
                                'id': 3002,
                                'esforco': 0.5,
                                'fase': {
                                    'id': 951,
                                    'nome': 'Codificação'
                                }
                            },
                            {
                                'id': 3003,
                                'esforco': 0.25,
                                'fase': {
                                    'id': 952,
                                    'nome': 'Requisitos'
                                }
                            }
                        ],
                        'fatoresAjuste': [
                            {
                                'id': 3051,
                                'nome': 'percentual',
                                'fator': 0.5,
                                'ativo': true,
                                'tipoAjuste': 'PERCENTUAL',
                                'impacto': null,
                                'descricao': 'percentual 50',
                                'codigo': 'codP',
                                'origem': 'origP'
                            },
                            {
                                'id': 3052,
                                'nome': 'unitario',
                                'fator': 2,
                                'ativo': true,
                                'tipoAjuste': 'UNITARIO',
                                'impacto': null,
                                'descricao': 'teste unitario fator 15',
                                'codigo': 'codU',
                                'origem': 'origU'
                            }
                        ]
                    },
                    'ativo': true
                }
            ],
            'sigla': 'EB',
            'logoId': 1002
        },
        'modulos': [
            {
                'id': 2001,
                'nome': 'novo mod pos componente',
                'funcionalidades': [
                    {
                        'id': 1953,
                        'nome': 'nova func no novo mod pos component'
                    }
                ]
            },
            {
                'id': 2002,
                'nome': 'n2',
                'funcionalidades': [
                    {
                        'id': 1954,
                        'nome': 'n2 func'
                    },
                    {
                        'id': 1955,
                        'nome': 'n2n2'
                    }
                ]
            },
            {
                'id': 2003,
                'nome': 'n 1',
                'funcionalidades': [
                    {
                        'id': 1956,
                        'nome': 'n 1'
                    }
                ]
            },
            {
                'id': 2004,
                'nome': 'novo modulo',
                'funcionalidades': [
                    {
                        'id': 1957,
                        'nome': 'nova func em novo modulo'
                    }
                ]
            },
            {
                'id': 1851,
                'nome': 'mod 1',
                'funcionalidades': [
                    {
                        'id': 1952,
                        'nome': 'novo pos component'
                    },
                    {
                        'id': 1910,
                        'nome': 'n'
                    },
                    {
                        'id': 1901,
                        'nome': '1'
                    },
                    {
                        'id': 1902,
                        'nome': '2'
                    },
                    {
                        'id': 1951,
                        'nome': 'cast'
                    }
                ]
            },
            {
                'id': 1852,
                'nome': 'mod 2',
                'funcionalidades': [
                    {
                        'id': 1904,
                        'nome': 'b'
                    },
                    {
                        'id': 1903,
                        'nome': 'a'
                    }
                ]
            }
        ]
    };

    let sistema: Sistema;

    beforeEach(() => {
        sistema = Sistema.fromJSON(sistemaJSON);
    });

    it('deve retornar o modulo certo para uma funcionalidade contida em um modulo', () => {
        const funcionalidadeId = 1952;
        const modulo: Modulo = ModuloDaFuncionalidadeFinder.find(sistema, funcionalidadeId);
        expect(modulo).not.toBeUndefined();
        expect(modulo.id).toEqual(1851);
        expect(modulo.nome).toEqual('mod 1');
    });

    it('deve retornar undefined para uma funcionalidade nao contida em um modulo', () => {
        const funcionalidadeId = 123456;
        const modulo: Modulo = ModuloDaFuncionalidadeFinder.find(sistema, funcionalidadeId);
        expect(modulo).toBeUndefined();
    });

});


