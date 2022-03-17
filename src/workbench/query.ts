//import axios from 'axios';

import { matthew } from 'workbench/trees/40-matthew';
import { mark } from 'workbench/trees/41-mark';
import { luke } from 'workbench/trees/42-luke';
import { john } from 'workbench/trees/43-john';
import { acts } from 'workbench/trees/44-acts';
import { romans } from 'workbench/trees/45-romans';

export const querySyntax = (
  bookNum: number,
  chapterNum: number,
  verseNum: number
) => {
  console.log('QUERY', bookNum, chapterNum, verseNum);
  console.log(matthew);
  console.log(mark);
  console.log(luke);
  console.log(john);
  console.log(acts);
  console.log(romans);
  //console.log('axios get');
  //axios.get(matthew).then((response: any) => {
  //console.log('Your xml file as string', response.data);
  //});
};
