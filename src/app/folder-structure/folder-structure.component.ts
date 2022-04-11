
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

export class NodeModel {
  type: 'folder' | 'file' | 'unset' | null = 'folder';
  name: string = '';
  level: number = 0;
  parentId?: number = 0;
  children: NodeModel[] = [];
  id?: number;
}

var TREE_DATA: NodeModel[] = [
  // {
  //   name: 'root',
  //   type: 'folder',
  //   id: 100,
  //   level: 0,
  //   parentId: 10,
  //   children: [],
  // },
];

// @Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<NodeModel[]>([]);
  get data(): NodeModel[] {
    return this.dataChange.value;
  }

  parentNodeMap = new Map<NodeModel, NodeModel>();

  constructor() {
    this.initialize();
  }

  initialize() {
    const data = TREE_DATA;
    this.dataChange.next(data);
  }

  buildFileTree(obj: object, level: number): NodeModel[] {
    // @pankaj This should recive Root node of Tree of Type FileNode
    // so we dont have to create a new node and use it as it is
    //console.log(obj);
    return Object.keys(obj).reduce<NodeModel[]>((accumulator, key) => {
      // console.log(key);
      const value = obj;
      const node = new NodeModel();
      node.id = level;

      node.level = level;
      node.name = key;
      node.parentId = 0;
      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  // inserting to the tree
  public insertItem(
    name: string,
    type: 'folder' | 'file' | 'unset' | null,
    parent: NodeModel
  ) {
    if (parent.children) {
      //console.log("insert ")

      //if (parent.type !== 'SECTION') {
      let newNode: NodeModel;
      newNode = new NodeModel();
      newNode.name = name;
      newNode.type = type;
      newNode.children = [];
      newNode.level = parent.level + 1;
      console.log('level', newNode.level);
      newNode.parentId = parent.id;
      newNode.id = newNode.level + (parent.children.length + 1) / 10.0;

      console.log('parent child length:', parent.children.length);
      console.log('newNode id ', newNode.id);

      parent.children.push(newNode);
      this.parentNodeMap.set(newNode, parent);
      //console.log(newNode);

      //} else {
      console.log('No More Nodes can be inserted');
      //}
      //this.dataChange.next(this.data);
    }
  }

  // removing from the tree
  public removeItem(currentNode: NodeModel, root: NodeModel) {
    const parentNode = this.parentNodeMap.get(currentNode);
    // const parentNode = this.findParent(currentNode.parentId, root);
    console.log('after find parent');
    console.log('parentNode ' + JSON.stringify(parentNode));

    // const index = parentNode.children.indexOf(currentNode);
    const index = parentNode?.children.indexOf(currentNode);
    console.log('index is: ', index);

    if (index !== -1) {
      // parentNode.children.splice(index, 1);
      parentNode?.children.splice(index as any, 1);
      this.dataChange.next(this.data);
      this.parentNodeMap.delete(currentNode);
    }
  }

  public findParent(id: number | undefined, node: any): any {
    console.log('id ' + id + ' node id is:' + node.id);

    if (node != undefined && node.id === id) {
      console.log('inside if');
      return node;
    } else {
      console.log('ELSE ' + JSON.stringify(node.children));
      for (let element in node.children) {
        console.log(
          'Recursive ' + JSON.stringify(node.children[element].children)
        );

        if (
          node.children[element].children != undefined &&
          node.children[element].children.length > 0
        ) {
          return this.findParent(id, node.children[element]);
        } else {
          continue;
        }
      }
    }
  }
}


@Component({
  selector: 'app-folder-structure',
  templateUrl: './folder-structure.component.html',
  styleUrls: ['./folder-structure.component.css'],
  providers: [FileDatabase],

})
export class FolderStructureComponent implements OnInit {
  @ViewChild('treeSelector') tree: any;
  nestedTreeControl: NestedTreeControl<NodeModel>;
  nestedDataSource: MatTreeNestedDataSource<NodeModel>;
  isLoaded = true;
  treeData: any = TREE_DATA.length;
  addNode = false;
  fileName = '';
  fileType:any;
  node: NodeModel = new NodeModel();
  ngOnInit(): void {
    console.log('inside on in it ');

    for (let i = 0; i < TREE_DATA.length; i++) {
      console.log(TREE_DATA[i]);
    }
  }
  constructor(public database: FileDatabase) {
    this.nestedTreeControl = new NestedTreeControl<NodeModel>(
      this._getChildren
    );
    this.nestedDataSource = new MatTreeNestedDataSource();
    database.dataChange.subscribe(
      (data) => (this.nestedDataSource.data = data)
    );
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.database.dataChange.subscribe(
      (data) => (this.nestedDataSource.data = data)
    );
  }

  hasNestedChild = (_: number, nodeData: NodeModel) => !nodeData.type;

  private _getChildren = (node: NodeModel) => node.children;

  addFileFolder(fileName:string){
    if(this.fileType){
      this.addNewItem(fileName,this.fileType,this.node);
    } else{
      this.loadData(fileName);
    }
    this.addNode = false;
  }
  loadData(name: string) {
    if (name !== '') {
      TREE_DATA.push({
        name: name,
        type: 'folder',
        id: 1.1,
        level: 1,
        parentId: 0.5,
        children: [],
      });
      this.renderChanges();
      this.isLoaded = false;
    }
  }
  addNewNode(
    type: 'folder' | 'file' | 'unset' | null,
    node: NodeModel
  ){
    this.fileName = '';
    this.fileType = type;
    this.addNode = true;
    this.node = node;
  }
  // actual operations:
  addNewItem(
    name: string,
    type: 'folder' | 'file' | 'unset' | null,
    node: NodeModel
  ) {
    if (name !== '') {
      this, this.database.insertItem(name, type, node);
      //this.tree.renderNodeChanges(this.database.data);
      this.nestedTreeControl.expand(node);
      //console.log(this.nestedTreeControl);

      this.renderChanges();
      // this.getTree();
    }
  }

  public remove(node: NodeModel) {
    console.log('currentNode is: ', TREE_DATA.length);
    if (
      node.id === 100 &&
      node.parentId === 10
      // node.children.length === 0
    ) {
      TREE_DATA.pop();
      this.renderChanges();
      this.isLoaded = true;
    } else {
      console.log('index 0 is: ', this.database.data[0]);

      this.database.removeItem(node, this.database.data[0]);
      this.renderChanges();
    }
  }

  getTree() {
    console.log(JSON.stringify(this.database.data));
  }
  renderChanges() {
    let data = this.nestedDataSource.data;
    this.nestedDataSource.data = [];
    this.nestedDataSource.data = data;
  }
}
