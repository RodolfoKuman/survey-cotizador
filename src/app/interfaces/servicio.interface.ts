export interface Servicio{
    id?: number,
    token_uuid?: string,
    gpon?: boolean,
    wifi?: boolean,
    cctv?: boolean,
    camaras_internas?: number,
    camaras_externas?: number,
    vertical_id?: number,
    tipo_servicio_id?: number,
    ct_survey_id?: number
    created_at?: string,
    updated_at?: string
}