export const detectionResultColors = {
  MOISISSURE_COULEUR: '#f68817',
  MOISISSURE_CLAIR: '#f68817',
  MOISISSURE_NOIRCIE: '#f68817',
  MOISISSURE: '#f68817',
  HUMIDITE_CLAIR: '#4987eb',
  HUMIDITE_INTENSE: '#4987eb',
  HUMIDITE: '#4987eb',
  USURE_LEGER: '#898c94',
  USURE_IMPORTANTE: '#898c94',
  USURE: '#898c94',
  OBSTACLE: '#ffffff',
  CHEMINEE: '#ffffff',
  VELUX: '#ffffff',
};

export const ANNOTATION_COVERING = [
  { value: 'tuiles-canal', label: 'Tuiles canal' },
  { value: 'tuiles-plates', label: 'Tuiles plates' },
  { value: 'ardoise', label: 'Ardoise' },
  { value: 'zinc', label: 'Zinc' },
  { value: 'shingle', label: 'Shingle' },
  { value: 'beton', label: 'Béton' },
  { value: 'bac-acier', label: 'Bac acier' },
  { value: 'bardeaux-bitumineux', label: 'Bardeaux bitumineux' },
  { value: 'fibro-ciment', label: 'Fibro-ciment' },
  { value: 'membrane-elastomere', label: 'Membrane élastomère' },
  { value: 'autres', label: 'Autres' },
];

export const coveringTypeMap = {
  ROOF_ARDOISE: 'Ardoise',
  ROOF_ASPHALTE_BITUME: 'Asphalte Bitume',
  ROOF_BAC_ACIER: 'Bac Acier',
  ROOF_BETON_BRUT: 'Béton brut',
  ROOF_FIBRO_CIMENT: 'Fibrociment',
  ROOF_GRAVIER: 'Gravier',
  ROOF_MEMBRANE_SYNTHETIQUE: 'Membrane synthétique',
  ROOF_TOLE_ONDULEE: 'Tôle ondulée',
  ROOF_TUILES: 'Tuiles',
  ROOF_ZINC: 'Zinc',
};

export const degradationLevels = [
  { label: 'A', color: '#47BE62', name: 'Bon état' },
  { label: 'B', color: '#F4FBAB', name: 'Entretien à prévoir' },
  { label: 'C', color: '#F9DD56', name: 'Entretien nécessaire' },
  { label: 'D', color: '#F38F4B', name: 'Réparation nécessaire' },
  { label: 'E', color: '#EF2C2D', name: 'Intervention urgente' },
];
