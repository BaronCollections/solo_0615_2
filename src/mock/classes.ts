export interface ClassInfo {
  id: string
  name: string
  grade: string
  teacher: string
  studentCount: number
  createdAt: string
}

export const mockClasses: ClassInfo[] = [
  {
    id: 'c1',
    name: '计算机科学1班',
    grade: '2024级',
    teacher: '李老师',
    studentCount: 45,
    createdAt: '2024-09-01'
  },
  {
    id: 'c2',
    name: '计算机科学2班',
    grade: '2024级',
    teacher: '王老师',
    studentCount: 42,
    createdAt: '2024-09-01'
  },
  {
    id: 'c3',
    name: '软件工程1班',
    grade: '2023级',
    teacher: '张老师',
    studentCount: 38,
    createdAt: '2023-09-01'
  }
]
