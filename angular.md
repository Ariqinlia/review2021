# 生命周期
[ngOnChanges]：设置或重新设置数据绑定的输入属性时响应。该方法接受当前和上一属性值的SimpleChanges对象。（这里发生得很频繁，所以在这里执行的任何操作都会显著影响性能）
[ngOnInit]：初始化指令、组件
[ngDoCheck]：用于检测和处理值的改变
[ngAfterContentInit]：当把内容投影进组件之后调用，[第一次调用ngDoCheck()之后调用，只调用一次]，只适用于组件
[ngAfterContentChecked]：每次完成被投影组件内容的变更检测之后调用
[ngAfterViewInit]：在angular初始化组件及其子组件的视图之后调用
[ngAfterViewChecked]：每次做完组件视图和子视图的变更检测之后调用
[ngOnDestroy]：在angular每次销毁组件或指令之前调用，通常用于移除事件监听

# 组件初始化时生命周期钩子调用顺序
ngOnChanges > ngOnInit > ngDoCheck > ngAfterContentInit > ngAfterContentChecked > ngAfterViewInit > ngAfterViewChecked

# 响应式表单
Angular提供了两种不同的方式来处理表单的输入验证：响应式表单和模板驱动表单
--------------------
响应式表单
--------------------
1.FormControl: 实例用于追踪单个表单控件的值和验证状态
2.FormGroup: 用于追踪一个表单控件组的值和状态
3.FormArray: 用于追踪表单控件数组的值和状态
[tips]：要使用响应式表单，在modules中的NgModule import ReactiveFormsModule，然后就可以使用FormControl,FormGroup,FormArray在组件中创建表单了
手动创建会比较繁琐，FormBuilder提供了三个方法：control(),group(),array()。这些方法都是工厂方法，用于在组件类中分别生成FormControl,FormGroup,FormArray
## 表单验证
内置验证器：Validators类中定义了11个内置验证器
- [min()]：要求控件的值大于或等于指定的数字，只有函数形式，没有指令形式
- [max()]：要求控件的值小于或等于指定的数字，只有函数形式，没有指令形式
- [required()]：必填项，非空值
- [requiredTrue()]：要求控件的值为真，通常用来验证检查框
- [email()]：要求控件的值能通过Email格式验证
- [minLength()]：最小长度，可使用H5中的minlength
- [maxLength()]：最大长度，maxlength
- [pattern()]：要求控件的值匹配某个正则表达式，用pattern也生效
- [nullValidator()]：什么都不做
- [compose()]：把多个验证器合并成一个函数，会返回指定控件的各个错误映射表的并集
- [composeAsync()]：把多个异步验证器合并成一个函数，会返回指定控件的各个错误映射表的并集
refer to https://blog.csdn.net/zwj_jyzl/article/details/90348405

# 权限校验
- 路由守卫[canActivate],控制能否访问路由
1.创建一个guard文件，写上满足哪些条件能够访问路由
2.在路由module中添加canActivate: [xxxGuard],可根据业务配置路由数据
3.并且在该文件中注入guard文件，providers: [xxxGuard]

- 页面元素权限控制
通过自定义指令来判断页面元素显示与否

# 指令与组件的区别
component的用途是创建一个组件并附上一些行为；
directive是在已经存在的DOM元素上附加一些行为
二者详细的区别如下：
1.component使用的注解@Component修饰，directive使用@Directive修饰
2.component通过组件化思想，基于组件来创建应用，把应用划分成细小的可重复使用的组件，directive是在已经存在的DOM元素上实现一些行为
3.component是可重复使用的组件，directive是可重复使用的行为

# 传值方式
## 父子组件的传值方式
（1）@Input() & @Output() (父子组件传值)
[@Input()]：子组件添加Input装饰器装饰的属性
- @Input('bindingPropertyName'),支持一个可选参数，用来指定组件绑定属性的名称，若没指定，则默认使用@Input()
eg: export class StepComponent implements OnInit {
        @Input() stepString: Array<String>;
        @Input('value') stepString: Array<String>;
    }
    父组件调用子组件传递数据
    <app-step [stepString]='data'></appstep>
    <app-step [value]='data'></appstep>
    在子组件初始化的时候，就会获得stepString的值，但在构造函数的时候还未获取，执行init()就获取到了
- @Component()装饰器中的inputs
eg: @Component(
        {
            selector: 'app-step',
            templateUrl: '...',
            ....
            inputs: ['stepString:value']
        }
    )
- setter & getter 可以在子组件改变并且获取改变后的值
eg: @Input('value')
    set stepString(value: Array<String>) { this._stepString = value; }
    get stepString() { return this._stepString; }
- ngOnchanges(): 修改父组件可以输入传入的数据
eg: 
    -----修改父组件可以输入传入的数据------
    <input type="text" [(ngModel)]="data" />
    <app-step [value]="data"></app-step>
    -----修改子组件接受每一个传入属性的当前值------
    @Input('value') stepString: Array<String>;
    ngOnChanges(changes: SimpleChanges): void {
        this.stepString = changes['stepString'].currentValue[0];
    }
[@Output()]：用来定义组件的输出属性
子组件添加@Output()装饰器属性
- @Output() stepString: EventEmitter<String> = new EventEmitter<String>();
- @Output('value') stepString: EventEmitter<String> = new EventEmitter<String>();
.....some action
this.stepString.emit(this.data); // xxx.emit(data) => 向父组件发射数据，父组件通过xxx接收子组件的输出事件并拿到数据
this.value.emit(this.data);
<app-step (stepString)="acceptValue($event)"></app-step>
<app-step (value)="acceptValue($event)"></app-step>
- @Component()中的outputs
eg: @Component({
        ...
        outputs: ['stepString:value'] // stepString是子组件中EventEmitter名称，value是子组件对外暴露的方法
    })
（2）@ViewChild & @ViewChildren (以父组件为交互中心)
    1.#localName,父组件利用本地变量进行数据交互
    ------父组件HTML-------
    <app-step #step></app-step>
    <button (click)="step.plusCount()"></button>
    -------子组件component------------
    plusCount() {....}
    父组件上绑定的是子组件上的方法，父组件点击会调用子组件方法修改属性。
    局限性：父子组件的链接必须全部在父组件中的模板中进行；
            父组件类本身的代码对子组件没有访问权
    2.@ViewChild(): 如果父组件类需要读取子组件的属性值或调用子组件的方法，可以把子组件作为ViewChild，注入到父组件里面。
                    ViewChild是属性装饰器，用来从模板视图中获取匹配的元素
    ----父组件-----
    <app-step #stepComponent></app-step>
    <button (click)="plusCount()"></button>
    -----父组件class----
    @ViewChild('stepComponent') StepComponent;
    plus() { this.stepComponent.plusCount(); }
    -----以类型名进行查询-----
    @ViewChild(StepComponent)
    3.@ViewChildren(),用来从模板视图中获取普配的多个元素，返回QueryList集合
（3）@ContentChild & @ContentChildren
    1.ng-content: 将指令内部的元素嵌入到指令的模板中去，并且可以对传入的元素进行选择，也叫内容投影。
    --------父组件--------
    <app-wrapper>
        <span>this is xx</span>
        <app-step></step>
    </app-wrapper>
    -------子组件--------
    <div class="yellow">
        <ng-content></ng-content>
    </div>
    <div>
        <ng-content select="app-step"></ng-content>
    </div>
    调用子组件的时候传入了一些自定义的内容，子组件定义了两个ng-content用于渲染父组件定义的内容。
    第一个渲染的是，第二个渲染的是<app-step>
    如果select查询不到app-step可以使用[ngProjectAs]
    ----------父组件--------
    <app-wrapper>
        <span>...</span>
        <ng-container ngProjectAs="app-step">
            <app-step></app-step>
        </ng-container>
    </app-wrapper>
    2.@ContentChild
    ---------父组件--------
    <app-wrapper>
        <app-step></app-step>
        <app-step #content1></app-step>
    </app-wrapper>
    ----------子组件--------
    <ng-content></ng-content>
    @ContentChild(stepComponent) StepComponent;
    @ContentChild('content1') stepComponent: StepComponent;
    3.@ContentChildren，通过投影方式设置的视图中获取匹配的多个元素，返回QueryList集合
-------------------------------------
@Content和@View的区别：
    相同点：都是属性装饰器，都有对应的复数形式装饰器，都支持Type<any> | Function | String类型的选择器
    不同点：ContentChild是通过ng-content设置的视图中获取匹配元素；
            ViewChild是从模板视图中获取匹配元素；
            在父组件的ngAfterContentInit生命周期钩子中才能成功获取ContentChild查询的元素；
            在ngAfterViewInit成功获取通过ViewChild查询的元素
## 非父子之间的传值
（1）service服务，需要双向的触发(发送消息、接收消息)
（2）使用BehaviorSubject，发布-订阅模式，当发布者改变数据时，所有的订阅者也会得到响应
## 路由传值
（1）在查询参数中传递
*****传递参数*******
<a [routerLink]="['/stock']" [queryParams]="{id: 1}">股票详情</a>
// http://localhost:4200/stock?id=1
*****接收参数*******
import { ActivatedRoute } from '@amgular/router';
export class StockComponent implements OnInit {
    private stockId: number;      
    constructor(private routeInfo: ActivatedRoute)   
    ngOnInit() {
        this.stockId = this.routeInfo.snapshot.queryParams['id'];
    }
}
（2）在路由路径中传递
*****修改配置*******
const routes: Routes = [
  {path: '', redirectTo: '/index', pathMatch: 'full'},
  {path: 'index', component: IndexComponent},
  {path: 'stock/:id', component: StocksComponent },
  {path: '**', component: ErrorPageComponent }
];
******传递数据******
<a [routerLink]="['/stock', 1]">股票详情</a>
// http://localhost:4200/stock/1
*****接收参数*******
this.stockId = this.routeInfo.snapshot.params['id'];
（3）在路由配置中传递
******路由配置配置******
const routes: Routes = [
  {path: '', redirectTo: '/index', pathMatch: 'full'},
  {path: 'index', component: IndexComponent, data: {title: 'Index Page'}},
  {path: 'stock/:id', component: StocksComponent, data: {title: 'Stock Page'}},
  {path: '**', component: ErrorPageComponent, data: {title: 'Stock Page'}}
];
******接受参数*********
this.title = this.routeInfo.snapshot.date[0]['title'];

## 其他传值方式
sessionStorage,localStorage,cookie