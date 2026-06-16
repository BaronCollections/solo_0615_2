export interface CourseInfo {
  id: string
  name: string
  teacher: string
  classId: string
  className: string
  schedule: string
  hours: number
  createdAt: string
}

export const mockCourses: CourseInfo[] = [
  {
    id: 'co1',
    name: '数据结构',
    teacher: '李老师',
    classId: 'c1',
    className: '计算机科学1班',
    schedule: '周一 1-2节',
    hours: 64,
    createdAt: '2024-09-01'
  },
  {
    id: 'co2',
    name: '操作系统',
    teacher: '王老师',
    classId: 'c1',
    className: '计算机科学1班',
    schedule: '周三 3-4节',
    hours: 48,
    createdAt: '2024-09-01'
  },
  {
    id: 'co3',
    name: '软件工程',
    teacher: '张老师',
    classId: 'c3',
    className: '软件工程1班',
    schedule: '周二 5-6节',
    hours: 56,
    createdAt: '2023-09-01'
  }
]
