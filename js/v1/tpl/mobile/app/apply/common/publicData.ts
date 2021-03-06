export const ModuleUrls = (key: string, id: string, kind: string): string => {
    const urlKey: { [key: string]: string } = {
        idcard_ocr: 'ocr',
        face_contrast: 'bioassay',
        phone_operator: 'operator',
    };
    return `/apply/module/${id}/${kind}/${urlKey[key]}`;
};
