export const selectors = {
  list: 'table.gall_list',
  row: '.ub-content',
  writer: '.ub-writer',
  article: 'div.view_content_wrap',
  attachment: 'ul.appending_file',
  comments: 'div.comment_wrap',
  contextMenuTarget: '.nickname,.ip,b>b',
  block: '.cleandc-block',
}

export const classes = {
  block: 'cleandc-block',
  row: 'ub-content',
  writer: 'ub-writer',
}
export const tag = { contextMenu: `<a href="javascript:" class="contextmenu"></a>` }

export default { selectors, classes, tag }
