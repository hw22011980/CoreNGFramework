import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFolderOpen, faFolder, faFile } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.css']
})
export class NavTreeComponent implements OnInit {

  public nodes: any[] = [];
  public node: any;
  public collapseAttr: string = "isCollapsed";
  public selectedAttr: string = "isSelected";
  
  /**
   * Providen data for tree.
   */
  @Input('data') data: any;

  @Input('disableClick') disableClick:boolean = false;

  /**
   * Manipulation raw data to use for nav tree and prepare is required.
   * Default is true.
   */
  @Input('prepareData') prepareData: boolean = true;

  /**
   * Name of id property in input data.
   */
  @Input('idAttr') idAttr: string = "id";

  /**
   * Name of children list property in input data.
   */
  @Input('childrenAttr') childrenAttr: string = "children";

  /**
   * Name of enable control property in input data.
   */
  @Input('enabledAttr') disabledAttr: string = "enable";

  /**
   * Name of visible control property in input data.
   */
  @Input('visibleAttr') visibleAttr: string = "visible";

  @Input()
  public openedFolderIcon: IconDefinition = faFolderOpen;

  @Input()
  public closedFolderIcon: IconDefinition = faFolder;

  @Input()
  public leafFolderIcon: IconDefinition = faFile;

  @Input('collapseNode')
  set collapseNode(value: boolean){
    this._recursiveEdit(this.nodes, this.collapseAttr, true);
    this._recursiveEditByNode(
      this.nodes, this.node, this.collapseAttr, value);
  }

  @Input('selectedNode')
  set selectedNode(value: boolean){
    this._recursiveEdit(this.nodes, this.selectedAttr, false);
    this._recursiveEditByNode(
      this.nodes, this.node, this.selectedAttr, value);
  }

  /**
   * On click node.
   */
  @Output() onClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    // Clone input data for protect.
    const cloned = this.data.map(x => Object.assign([], x));

    // If data is raw, prepare data with recursive function.
    this.nodes = this.prepareData ? this._preparedData(cloned) : this.data;
  }

  click(node: any) {
    this.node = node;
    this.selectedNode = true;
    if (node[this.childrenAttr].length) {
      this.collapseNode = !node[this.collapseAttr];
    }
    this.onClick.emit(node);
  }

  change(value: any) {
    
  }

  public changeDataByNodeId(nodeId: string, parentId: string){
    if(nodeId == '' && parentId == ''){
      this._recursiveEdit(this.nodes, this.collapseAttr, true);
      this._recursiveEdit(this.nodes, this.selectedAttr, false);
      this.node = null;
    }
    else if(nodeId != '' && parentId == ''){
      this.node = this.getNodeById(this.nodes, nodeId);
      this.selectedNode = true;
      this.collapseNode = true;
    }else if(nodeId != '' && parentId != ''){
      this.node = this.getNodeById(this.nodes, nodeId);
      this.selectedNode = true;
      let parentNode = this.getNodeById(this.nodes, parentId);
      this._recursiveEdit(this.nodes, this.collapseAttr, true);
      this._recursiveEditByNode(this.nodes, parentNode, this.collapseAttr, false);
    }
  }

  // Use for selecteAll and collapseAll
  private _recursiveEdit(list, attr, value) {
    if (Array.isArray(list)) {
      for (let i = 0, len = list.length; i < len; i++) {
        list[i][attr] = value;
        if (list[i][this.childrenAttr].length) {
          this._recursiveEdit(list[i][this.childrenAttr], attr, value);
        }
      }
    }
  }

  // Use for selected by node, collapsed by node
  private _recursiveEditByNode(list, node, attr, value){
    if(Array.isArray(list)){
      for(let i=0, len = list.length; i < len; i++){
        if(list[i][this.idAttr] == node[this.idAttr]){
          list[i][attr] = value;
        }
        else if(list[i][this.childrenAttr].length){
          this._recursiveEditByNode(list[i][this.childrenAttr], node, attr, value);
        }
      }
    }
  }
  
  private _preparedData(list){
    //Only need for first time initialization
    for(let i=0, len = list.length; i < len; i++){
      list[i][this.collapseAttr] = true;
      list[i][this.selectedAttr] = false;
      if(list[i][this.childrenAttr]){
        this._preparedData(list[i][this.childrenAttr]);
      }else{
        list[i][this.childrenAttr] = [];
      }
    }
    return list;
  }

  private getNodeById(list, id:string){
    let result = null;
    for(let i=0, len = list.length; i < len; i++){
      if(list[i][this.idAttr] === id){
        result = list[i];
      }else if(list[i][this.childrenAttr].length){
        result = this.getNodeById(list[i][this.childrenAttr], id);
      }

      if(result) break;
    }
    return result;
  }

}
