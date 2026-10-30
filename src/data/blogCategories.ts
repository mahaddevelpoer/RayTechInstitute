export const BLOG_CATEGORIES = [
  {id:'date-sheets',label:'Date Sheets'},
  {id:'admissions',label:'Admissions'},
  {id:'career-guides',label:'Career Guides'},
  {id:'general',label:'General'},
  {id:'sports',label:'Sports'},
  {id:'technology',label:'Technology'},
  {id:'science',label:'Science & Environment'},
  {id:'economy',label:'Economy & Business'},
  {id:'world-affairs',label:'World Affairs'},
  {id:'entertainment',label:'Entertainment & Culture'},
  {id:'education',label:'Education'},
] as const;
export const blogCategoryLabel=(id:string)=>BLOG_CATEGORIES.find(category=>category.id===id)?.label||'General';
