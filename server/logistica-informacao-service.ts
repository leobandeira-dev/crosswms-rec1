/**
 * Logística da Informação SOAP Service
 * 
 * Implementa integração com a API SOAP da Logística da Informação
 * para consulta de NFe usando SOAP 1.1 (text/xml + SOAPAction)
 */
import { DOMParser } from 'xmldom';

export interface LogisticaInformacaoResponse {
  success: boolean;
  data?: any;
  xml_content?: string;
  error?: string;
  nfe_not_found?: boolean;
  api_error?: boolean;
  invalid_xml?: boolean;
  source?: string;
}

export class LogisticaInformacaoService {
  private cnpj: string;
  private token: string;
  private baseUrl = 'https://ws.logisticadainformacao.srv.br/consultanfe/consultanfe.asmx';

  constructor(cnpj: string, token: string) {
    this.cnpj = cnpj;
    this.token = token;
  }

  /**
   * Consulta NFe via SOAP 1.1
   */
  async fetchNFeXML(chaveNotaFiscal: string): Promise<LogisticaInformacaoResponse> {
    try {
      console.log(`[Logística] Iniciando consulta SOAP para chave: ${chaveNotaFiscal}`);

      // Montar o envelope SOAP 1.2
      const soapEnvelope = this.createSOAPEnvelope(chaveNotaFiscal);
      
      // Fazer a requisição SOAP
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'SOAPAction': '"http://tempuri.org/ConsultaNFe"'
        },
        body: soapEnvelope
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log(`[Logística] Resposta SOAP recebida: ${responseText.substring(0, 200)}...`);

      // Processar resposta SOAP
      return this.parseSOAPResponse(responseText);

    } catch (error: any) {
      console.error('[Logística] Erro na consulta SOAP:', error);
      return {
        success: false,
        error: error.message || 'Erro na comunicação com a API',
        api_error: true,
        source: 'logistica_soap_error'
      };
    }
  }

  /**
   * Cria o envelope SOAP 1.1 para consulta NFe
   */
  private createSOAPEnvelope(chaveNotaFiscal: string): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ConsultaNFe xmlns="http://tempuri.org/">
      <CNPJ>${this.cnpj}</CNPJ>
      <Token>${this.token}</Token>
      <chDOC>${chaveNotaFiscal}</chDOC>
    </ConsultaNFe>
  </soap:Body>
</soap:Envelope>`;
  }

  /**
   * Processa a resposta SOAP e extrai os dados da NFe
   */
  private async parseSOAPResponse(responseText: string): Promise<LogisticaInformacaoResponse> {
    try {
      // Verificar se há erro na resposta SOAP
      if (responseText.includes('faultstring') || responseText.includes('soap:Fault')) {
        const errorMatch = responseText.match(/<faultstring>(.*?)<\/faultstring>/);
        const error = errorMatch ? errorMatch[1] : 'Erro desconhecido na API';
        
        if (error.toLowerCase().includes('não encontrada') || error.toLowerCase().includes('not found')) {
          return {
            success: false,
            error: 'NFe não encontrada na base de dados',
            nfe_not_found: true,
            source: 'logistica_soap'
          };
        }
        
        return {
          success: false,
          error: `Erro da API: ${error}`,
          api_error: true,
          source: 'logistica_soap'
        };
      }

      // Extrair o resultado da consulta
      const resultMatch = responseText.match(/<ConsultaNFeResult>([\s\S]*?)<\/ConsultaNFeResult>/);
      if (!resultMatch) {
        return {
          success: false,
          error: 'Resposta SOAP inválida - resultado não encontrado',
          api_error: true,
          source: 'logistica_soap'
        };
      }

      const rawContent = resultMatch[1];
      const xmlContent = this.decodeXmlEntities(rawContent);
      
      // Verificar se o XML está vazio ou contém erro
      if (!xmlContent || xmlContent.trim() === '' || xmlContent.toLowerCase().includes('erro')) {
        return {
          success: false,
          error: 'NFe não encontrada ou XML vazio',
          nfe_not_found: true,
          source: 'logistica_soap'
        };
      }

      // Parsear o XML da NFe
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      // Verificar se o XML é válido
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        return {
          success: false,
          error: 'XML da NFe inválido ou corrompido',
          invalid_xml: true,
          source: 'logistica_soap'
        };
      }

      // Extrair dados da NFe
      const nfeData = this.extractNFeData(xmlDoc);
      
      return {
        success: true,
        data: nfeData,
        xml_content: xmlContent,
        source: 'logistica_soap'
      };

    } catch (error: any) {
      console.error('[Logística] Erro ao processar resposta SOAP:', error);
      return {
        success: false,
        error: 'Erro ao processar resposta da API',
        api_error: true,
        source: 'logistica_soap'
      };
    }
  }

  /**
   * Decodifica entidades XML escapadas (&lt; &gt; &amp; &quot; &#39;)
   */
  private decodeXmlEntities(text: string): string {
    return text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  /**
   * Extrai dados da NFe do XML
   */
  private extractNFeData(xmlDoc: Document): any {
    const getValue = (tagName: string): string => {
      const element = xmlDoc.getElementsByTagName(tagName)[0];
      return element ? element.textContent || '' : '';
    };

    return {
      // Dados básicos da NFe
      chave_nota_fiscal: getValue('chNFe'),
      numero_nota: getValue('nNF'),
      serie_nota: getValue('serie'),
      data_hora_emissao: getValue('dhEmi'),
      natureza_operacao: getValue('natOp'),
      
      // Dados do emitente
      emitente_cnpj: getValue('CNPJ'),
      emitente_razao_social: getValue('xNome'),
      emitente_nome_fantasia: getValue('xFant'),
      emitente_inscricao_estadual: getValue('IE'),
      emitente_endereco: getValue('xLgr'),
      emitente_numero: getValue('nro'),
      emitente_bairro: getValue('xBairro'),
      emitente_municipio: getValue('xMun'),
      emitente_uf: getValue('UF'),
      emitente_cep: getValue('CEP'),
      
      // Dados do destinatário
      destinatario_cnpj: getValue('CNPJ') || getValue('CPF'),
      destinatario_razao_social: getValue('xNome'),
      destinatario_inscricao_estadual: getValue('IE'),
      destinatario_endereco: getValue('xLgr'),
      destinatario_numero: getValue('nro'),
      destinatario_bairro: getValue('xBairro'),
      destinatario_municipio: getValue('xMun'),
      destinatario_uf: getValue('UF'),
      destinatario_cep: getValue('CEP'),
      
      // Dados de transporte
      modalidade_frete: getValue('modFrete'),
      transportadora_cnpj: getValue('CNPJ'),
      transportadora_razao_social: getValue('xNome'),
      veiculo_placa: getValue('placa'),
      veiculo_uf: getValue('UF'),
      
      // Dados de volume
      volume_quantidade: getValue('qVol'),
      volume_especie: getValue('esp'),
      volume_marca: getValue('marca'),
      volume_numeracao: getValue('nVol'),
      volume_peso_liquido: getValue('pesoL'),
      volume_peso_bruto: getValue('pesoB'),
      
      // Valores
      valor_total_produtos: getValue('vProd'),
      valor_total_servicos: getValue('vServ'),
      valor_total_nota: getValue('vNF'),
      valor_frete: getValue('vFrete'),
      valor_seguro: getValue('vSeg'),
      valor_desconto: getValue('vDesc'),
      valor_outras_despesas: getValue('vOutro'),
      
      // Informações adicionais
      informacoes_complementares: getValue('infCpl'),
      chave_acesso: getValue('chNFe')
    };
  }
}