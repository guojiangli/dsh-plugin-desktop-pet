export declare const STORAGE_KEY = "dsh.desktop-pet.config.v1";
export declare const CHANGE_EVENT = "dsh-desktop-pet/change";
export declare const MAX_IMAGE_BYTES: number;
export type PetMotion = 'none' | 'float' | 'bounce';
export interface PetPosition {
    x: number;
    y: number;
}
export interface PetConfig {
    enabled: boolean;
    name: string;
    size: number;
    motion: PetMotion;
    showProgress: boolean;
    image: string;
    position: PetPosition | null;
}
export declare const DEFAULT_CONFIG: Readonly<PetConfig>;
export declare function sanitizeConfig(value: unknown): PetConfig;
export declare function readConfig(storage?: Pick<Storage, 'getItem'>): PetConfig;
export declare function writeConfig(value: unknown, storage?: Pick<Storage, 'setItem'>): PetConfig;
export declare function usePetConfig(): readonly [PetConfig, (patch: Partial<PetConfig>) => PetConfig];
//# sourceMappingURL=config.d.ts.map