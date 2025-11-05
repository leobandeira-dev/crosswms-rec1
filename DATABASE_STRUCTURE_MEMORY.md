# Estrutura do Banco de Dados CrossWMS

## Visão Geral
Este documento contém a estrutura completa do banco de dados do sistema CrossWMS, baseado no schema Drizzle ORM.

## Tabelas Principais

### 1. users (Usuários)
- **id**: varchar (UUID primário)
- **email**: varchar (único, não nulo)
- **password**: varchar (não nulo)
- **nome**: varchar (não nulo)
- **empresa_id**: varchar (FK para empresas)
- **perfil_id**: varchar (FK para perfis)
- **status**: varchar (default: "ativo")
- **created_at**: timestamp
- **updated_at**: timestamp

### 2. sessions (Sessões)
- **id**: varchar (UUID primário)
- **token**: varchar (único, não nulo)
- **user_id**: varchar (não nulo, FK para users)
- **expires_at**: timestamp (não nulo)
- **created_at**: timestamp

### 3. empresas (Empresas)
- **id**: varchar (UUID primário)
- **cnpj**: varchar (único, não nulo)
- **razao_social**: varchar (não nulo)
- **nome_fantasia**: varchar
- **endereco**: text
- **telefone**: varchar
- **email**: varchar
- **tipo**: varchar (cliente, transportadora, etc)
- **status**: varchar (default: "ativo")
- **created_at**: timestamp
- **updated_at**: timestamp

### 4. perfis (Perfis de Acesso)
- **id**: varchar (UUID primário)
- **nome**: varchar (não nulo)
- **descricao**: text
- **ativo**: boolean (default: true)
- **created_at**: timestamp
- **updated_at**: timestamp

### 5. permissoes (Permissões)
- **id**: varchar (UUID primário)
- **nome**: varchar (não nulo)
- **descricao**: text
- **modulo**: varchar
- **acao**: varchar
- **created_at**: timestamp

### 6. perfil_permissoes (Relação Perfil-Permissões)
- **id**: varchar (UUID primário)
- **perfil_id**: varchar (não nulo, FK para perfis)
- **permissao_id**: varchar (não nulo, FK para permissoes)
- **created_at**: timestamp

### 7. perfil_modulos (Módulos por Perfil)
- **id**: varchar (UUID primário)
- **perfil_id**: varchar (não nulo, FK para perfis)
- **modulo**: varchar (não nulo)
- **ativo**: boolean (default: true)
- **created_at**: timestamp

### 8. assinaturas (Assinaturas das Empresas)
- **id**: varchar (UUID primário)
- **empresa_id**: varchar (não nulo, FK para empresas)
- **plano**: varchar (não nulo)
- **status**: varchar (default: "ativa")
- **data_inicio**: timestamp
- **data_fim**: timestamp
- **valor**: decimal
- **created_at**: timestamp
- **updated_at**: timestamp

### 9. password_reset_tokens (Tokens de Reset de Senha)
- **id**: varchar (UUID primário)
- **user_id**: varchar (não nulo, FK para users)
- **token**: varchar (único, não nulo)
- **expires_at**: timestamp (não nulo)
- **used**: boolean (default: false)
- **created_at**: timestamp

### 10. configuracoes_email (Configurações de Email)
- **id**: varchar (UUID primário)
- **empresa_id**: varchar (não nulo, FK para empresas)
- **smtp_host**: varchar
- **smtp_port**: integer
- **smtp_user**: varchar
- **smtp_password**: varchar
- **from_email**: varchar
- **from_name**: varchar
- **ativo**: boolean (default: true)
- **created_at**: timestamp
- **updated_at**: timestamp

### 11. configuracoes_sistema (Configurações do Sistema)
- **id**: varchar (UUID primário)
- **empresa_id**: varchar (não nulo, FK para empresas)
- **logistica_cnpj**: varchar (API Logística da Informação)
- **logistica_token**: varchar
- **logistica_enabled**: boolean (default: false)
- **crossxml_api_key**: varchar (API CrossXML)
- **crossxml_enabled**: boolean (default: false)
- **nsdocs_client_id**: varchar (API NSDocs)
- **nsdocs_client_secret**: varchar
- **nsdocs_enabled**: boolean (default: false)
- **sistema_versao**: varchar (default: "CrossWMS v2.0")
- **sistema_ambiente**: varchar (default: "production")
- **backup_automatico**: boolean (default: true)
- **backup_horario**: varchar (default: "02:00")
- **sessao_timeout**: varchar (default: "60")
- **max_tentativas_login**: varchar (default: "5")
- **senha_complexidade**: boolean (default: true)
- **notif_email_novos_usuarios**: boolean (default: true)
- **notif_email_aprovacoes**: boolean (default: true)
- **notif_email_operacoes**: boolean (default: false)
- **created_at**: timestamp
- **updated_at**: timestamp

### 12. motoristas (Motoristas)
- **id**: varchar (UUID primário)
- **nome**: varchar (não nulo)
- **cpf**: varchar (único)
- **cnh**: varchar
- **telefone**: varchar
- **empresa_id**: varchar (FK para empresas)
- **status**: varchar (default: "ativo")
- **disponivel**: boolean (default: true)
- **created_at**: timestamp
- **updated_at**: timestamp

### 13. veiculos (Veículos)
- **id**: varchar (UUID primário)
- **placa**: varchar (único, não nulo)
- **modelo**: varchar
- **marca**: varchar
- **ano**: integer
- **capacidade_peso**: decimal
- **capacidade_volume**: decimal
- **empresa_id**: varchar (FK para empresas)
- **status**: varchar (default: "ativo")
- **created_at**: timestamp
- **updated_at**: timestamp

### 14. clientes_transportador (Clientes Transportador)
- **id**: varchar (UUID primário)
- **razao_social**: varchar (não nulo)
- **nome_fantasia**: varchar
- **cnpj**: varchar (único)
- **endereco**: text
- **telefone**: varchar
- **email**: varchar
- **contrato_inicio**: timestamp
- **contrato_fim**: timestamp
- **status**: varchar (default: "ativo")
- **empresa_transportadora_id**: varchar (FK para empresas)
- **created_at**: timestamp
- **updated_at**: timestamp

### 15. coletas (Coletas)
- **id**: varchar (UUID primário)
- **numero_coleta**: varchar (não nulo)
- **empresa_cliente_id**: varchar (não nulo, FK para empresas)
- **endereco_coleta**: text (não nulo)
- **data_solicitacao**: timestamp (default: now)
- **data_prevista**: timestamp
- **status**: varchar (default: "solicitada")
- **observacoes**: text
- **usuario_solicitante_id**: varchar (não nulo, FK para users)
- **zona**: varchar
- **created_at**: timestamp
- **updated_at**: timestamp

### 16. ordens_carga (Ordens de Carga)
- **id**: varchar (UUID primário)
- **numero_ordem**: varchar (não nulo)
- **tipo_carregamento**: varchar (não nulo)
- **empresa_cliente_id**: varchar (não nulo, FK para empresas)
- **motorista_id**: varchar (FK para motoristas)
- **veiculo_id**: varchar (FK para veiculos)
- **data_prevista**: timestamp (não nulo)
- **status**: varchar (default: "planejada")
- **observacoes**: text
- **usuario_responsavel_id**: varchar (não nulo, FK para users)
- **created_at**: timestamp
- **updated_at**: timestamp

### 17. itens_carga (Itens da Carga)
- **id**: varchar (UUID primário)
- **ordem_carga_id**: varchar (não nulo, FK para ordens_carga)
- **nota_fiscal_id**: varchar (FK para notas_fiscais)
- **descricao**: text
- **quantidade**: integer
- **peso**: decimal
- **volume**: decimal
- **created_at**: timestamp

### 18. ocorrencias (Ocorrências)
- **id**: varchar (UUID primário)
- **tipo_ocorrencia**: varchar (não nulo)
- **descricao**: text (não nulo)
- **prioridade**: varchar (default: "media")
- **status**: varchar (default: "aberta")
- **empresa_cliente_id**: varchar (FK para empresas)
- **usuario_reportou_id**: varchar (não nulo, FK para users)
- **usuario_responsavel_id**: varchar (FK para users)
- **data_resolucao**: timestamp
- **created_at**: timestamp
- **updated_at**: timestamp

### 19. carregamentos (Carregamentos)
- **id**: varchar (UUID primário)
- **numero_carregamento**: varchar (não nulo)
- **status**: varchar (default: "planejado")
- **data_inicio**: timestamp
- **data_fim**: timestamp
- **motorista_id**: varchar (FK para motoristas)
- **veiculo_id**: varchar (FK para veiculos)
- **empresa_id**: varchar (não nulo, FK para empresas)
- **observacoes**: text
- **created_at**: timestamp
- **updated_at**: timestamp

### 20. notas_fiscais (Notas Fiscais)
- **id**: varchar (UUID primário)
- **numero**: varchar (não nulo)
- **serie**: varchar
- **chave_acesso**: varchar
- **data_emissao**: timestamp
- **valor_total**: decimal
- **peso_total**: decimal
- **volume_total**: decimal
- **remetente_id**: varchar
- **destinatario_id**: varchar
- **transportador_id**: varchar
- **empresa_id**: varchar (não nulo, FK para empresas)
- **status**: varchar (default: "pendente")
- **xml_content**: text
- **created_at**: timestamp
- **updated_at**: timestamp

### 21. volumes_etiqueta (Volumes/Etiquetas)
- **id**: varchar (UUID primário)
- **codigo_etiqueta**: varchar (único, não nulo)
- **nota_fiscal_id**: varchar (não nulo, FK para notas_fiscais)
- **numero_volume**: integer
- **descricao**: varchar
- **peso**: decimal
- **peso_kg**: varchar
- **altura_cm**: varchar
- **largura_cm**: varchar
- **comprimento_cm**: varchar
- **volume_m3**: varchar
- **dimensoes**: varchar
- **status**: varchar (default: "recebido")
- **posicao_armazenagem**: varchar
- **empresa_id**: varchar (FK para empresas)
- **created_at**: timestamp
- **updated_at**: timestamp

### 22. historico_versoes (Histórico de Versões)
- **id**: varchar (UUID primário)
- **versao**: varchar (não nulo)
- **data_lancamento**: timestamp (não nulo)
- **descricao**: text (não nulo)
- **tipo_atualizacao**: varchar (não nulo)
- **empresa_id**: varchar (FK para empresas)
- **created_at**: timestamp
- **updated_at**: timestamp

### 23. pacotes_sistema (Pacotes do Sistema)
- **id**: varchar (UUID primário)
- **nome**: varchar (não nulo)
- **descricao**: text
- **versao**: varchar
- **preco**: decimal
- **ativo**: boolean (default: true)
- **categoria**: varchar
- **created_at**: timestamp
- **updated_at**: timestamp

### 24. modulos_sistema (Módulos do Sistema)
- **id**: varchar (UUID primário)
- **nome**: varchar (não nulo)
- **descricao**: text
- **categoria**: varchar
- **icone**: varchar
- **rota**: varchar
- **ativo**: boolean (default: true)
- **ordem**: integer
- **created_at**: timestamp
- **updated_at**: timestamp

### 25. fila_x (Filas de Processamento)
- **id**: varchar (UUID primário)
- **nome**: varchar (não nulo)
- **descricao**: text
- **prioridade**: integer (default: 1)
- **status**: varchar (default: "ativa")
- **empresa_id**: varchar (FK para empresas)
- **capacidade_maxima**: integer
- **tempo_processamento**: integer
- **created_at**: timestamp
- **updated_at**: timestamp

### 26. ordens_fila_x (Ordens na Fila)
- **id**: varchar (UUID primário)
- **fila_id**: varchar (não nulo, FK para fila_x)
- **ordem_carga_id**: varchar (FK para ordens_carga)
- **carregamento_id**: varchar (FK para carregamentos)
- **posicao**: integer
- **status**: varchar (default: "pendente")
- **prioridade**: integer (default: 1)
- **data_entrada**: timestamp (default: now)
- **data_inicio**: timestamp
- **data_conclusao**: timestamp
- **usuario_id**: varchar (FK para users)
- **observacoes**: text
- **created_at**: timestamp
- **updated_at**: timestamp

### 27. historico_fila_x (Histórico da Fila)
- **id**: varchar (UUID primário)
- **fila_id**: varchar (não nulo, FK para fila_x)
- **ordem_fila_id**: varchar (FK para ordens_fila_x)
- **acao**: varchar (não nulo)
- **status_anterior**: varchar
- **status_novo**: varchar
- **usuario_id**: varchar (FK para users)
- **observacoes**: text
- **dados_adicionais**: jsonb
- **created_at**: timestamp (default: now)

## Relacionamentos
- **users** → **empresas** (empresa_id)
- **users** → **perfis** (perfil_id)
- **sessions** → **users** (user_id)
- **perfil_permissoes** → **perfis** (perfil_id)
- **perfil_permissoes** → **permissoes** (permissao_id)
- **perfil_modulos** → **perfis** (perfil_id)
- **assinaturas** → **empresas** (empresa_id)
- **password_reset_tokens** → **users** (user_id)
- **configuracoes_email** → **empresas** (empresa_id)
- **configuracoes_sistema** → **empresas** (empresa_id)
- **motoristas** → **empresas** (empresa_id)
- **veiculos** → **empresas** (empresa_id)
- **clientes_transportador** → **empresas** (empresa_transportadora_id)
- **coletas** → **empresas** (empresa_cliente_id)
- **coletas** → **users** (usuario_solicitante_id)
- **ordens_carga** → **empresas** (empresa_cliente_id)
- **ordens_carga** → **motoristas** (motorista_id)
- **ordens_carga** → **veiculos** (veiculo_id)
- **ordens_carga** → **users** (usuario_responsavel_id)
- **itens_carga** → **ordens_carga** (ordem_carga_id)
- **itens_carga** → **notas_fiscais** (nota_fiscal_id)
- **ocorrencias** → **empresas** (empresa_cliente_id)
- **ocorrencias** → **users** (usuario_reportou_id, usuario_responsavel_id)
- **carregamentos** → **empresas** (empresa_id)
- **carregamentos** → **motoristas** (motorista_id)
- **carregamentos** → **veiculos** (veiculo_id)
- **notas_fiscais** → **empresas** (empresa_id)
- **volumes_etiqueta** → **notas_fiscais** (nota_fiscal_id)
- **volumes_etiqueta** → **empresas** (empresa_id)
- **historico_versoes** → **empresas** (empresa_id)
- **fila_x** → **empresas** (empresa_id)
- **ordens_fila_x** → **fila_x** (fila_id)
- **ordens_fila_x** → **ordens_carga** (ordem_carga_id)
- **ordens_fila_x** → **carregamentos** (carregamento_id)
- **ordens_fila_x** → **users** (usuario_id)
- **historico_fila_x** → **fila_x** (fila_id)
- **historico_fila_x** → **ordens_fila_x** (ordem_fila_id)
- **historico_fila_x** → **users** (usuario_id)

## Índices e Constraints
- UUIDs gerados automaticamente com `gen_random_uuid()`
- Timestamps com valores padrão `defaultNow()`
- Chaves únicas em campos como email, cnpj, placa, etc.
- Status com valores padrão para facilitar a gestão de workflow

## Observações Importantes
- Sistema multi-empresa: todas as tabelas principais têm referência à tabela empresas
- Sistema de permissões granular com perfis e permissões separadas
- Suporte a múltiplas APIs externas (Logística da Informação, CrossXML, NSDocs)
- Sistema de filas para processamento de ordens
- Rastreamento completo de auditoria com timestamps em todas as tabelas
- Sistema de versionamento para atualizações do sistema