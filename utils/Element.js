export const selectors = {
  list: 'table.gall_list tbody',
  row: '.ub-content',
  writer: '.ub-writer',
  article: 'div.view_content_wrap',
  attachment: 'ul.appending_file',
  comments: 'div.comment_wrap',
  editor: 'div.editor_wrap',
  write: '#write',
  contextMenuTarget: '.nickname>em,.ip>em,b>b',
  block: '.cleandc-block',
  articleContent: '.writing_view_box'
}

export const classes = {
  block: 'cleandc-block',
  row: 'ub-content',
  writer: 'ub-writer',
}
export const tag = { contextMenu: '<a href="javascript:" class="contextmenu"></a>' }

export default { selectors, classes, tag }
