export const subjects = [
  { label: 'Selecionar matéria', value: '' },
  { label: 'Matemática', value: 'matematica' },
  { label: 'Português', value: 'portugues' },
  { label: 'Física', value: 'fisica' },
  { label: 'Química', value: 'quimica' },
  { label: 'Biologia', value: 'biologia' },
  { label: 'Inglês', value: 'ingles' },
  { label: 'Ciência da Computação', value: 'ciencia_de_computacao' },
  { label: 'Economia', value: 'economia' },
] as const;

export type Subject = typeof subjects[number]['value'];
