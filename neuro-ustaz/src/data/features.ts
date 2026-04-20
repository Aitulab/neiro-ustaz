import type { Feature } from '../types';

export const homeFeatures: Feature[] = [
  {
    id: 'ai-generation',
    icon: 'psychology',
    title: 'AI генерациясы',
    description: 'Күрделі тапсырмаларды бірнеше секунд ішінде генерациялау мүмкіндігі.',
  },
  {
    id: 'easy-interface',
    icon: 'dashboard_customize',
    title: 'Ыңғайлы интерфейс',
    description: 'Интуитивті және түсінікті интерфейс арқылы жылдам нәтижеге қол жеткізіңіз.',
  },
  {
    id: 'for-students',
    icon: 'school',
    title: 'Студенттерге арналған',
    description: 'Болашақ ұстаздар мен педагогикалық мамандықтағы студенттерге арнайы әзірленген.',
  },
  {
    id: 'time-saving',
    icon: 'timer',
    title: 'Уақыт үнемдеу',
    description: 'Құжаттама мен материалдарды дайындауға кететін уақытты 90%-ға азайтыңыз.',
  },
  {
    id: 'online-access',
    icon: 'cloud_done',
    title: 'Онлайн қолжетімділік',
    description: 'Кез келген жерден, кез келген уақытта материалдарыңызға қол жеткізіңіз.',
  },
  {
    id: 'fast-result',
    icon: 'speed',
    title: 'Жылдам нәтиже',
    description: 'Нейрондық желінің көмегімен сапалы материалдарды лезде алыңыз.',
  },
];

export const communityFeatures: Feature[] = [
  {
    id: 'lesson-plan',
    icon: 'menu_book',
    title: 'Сабақ жоспарын дайындау',
    description: 'Сабақ жоспарын (КСП) секунд ішінде жасаңыз. Пән мен тақырыпты таңдаңыз, қалғанын AI жасайды.',
    cta: 'Бастау',
  },
  {
    id: 'practice-prep',
    icon: 'school',
    title: 'Практикаға дайындалу',
    description: 'Педагогикалық практикаға қажетті құжаттар мен дайындық материалдары.',
    cta: 'Толығырақ',
  },
  {
    id: 'ped-ideas',
    icon: 'lightbulb',
    title: 'Педагогикалық идеялар алу',
    description: 'Оқушыларды қызықтырудың жаңа әдістері мен креативті идеялар жинағы.',
    cta: 'Көру',
  },
  {
    id: 'presentations',
    icon: 'present_to_all',
    title: 'Презентация жасау',
    description: 'Көрнекі материалдар мен презентацияларды AI арқылы безендіріңіз. Сабағыңызды есте қаларлықтай етіңіз.',
    cta: 'Жасауды бастау',
  },
];

export const quickActions = [
  { label: 'КСП құрастыру', icon: 'description' },
  { label: 'СОЧ дайындау', icon: 'quiz' },
  { label: 'Сабақ жоспары', icon: 'event_note' },
  { label: 'Тапсырмалар жасау', icon: 'edit_document' },
];
