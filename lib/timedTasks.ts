export default class TimedTasks<T extends string> {
  // 任务栈
  private taskStack = new Map<string, null | [NodeJS.Timeout, () => void]>();
  // 消息队列
  private message: Record<string, (param: any) => void> = {};
  // 任务类型
  taskType: "Interval" | "Timeout";

  constructor(taskType: "Interval" | "Timeout", taskList: T[]) {
    this.taskType = taskType;
    taskList.forEach((item) => {
      this.taskStack.set(item, null);
    });
  }

  /**
   * @description 创建任务
   * @param { string } taskName 任务名称
   * @param { () => void | Promise<void> } task 任务回调函数
   * @param { number } timeout 执行时间
   * @param { any } param 剩余参数，可用于on后回传
   */
  create(
    taskName: T,
    task: () => void | Promise<void>,
    timeout: number = 0,
    param: any
  ) {
    // 重复创建报错
    if (!this.taskStack.has(taskName)) {
      console.error(`⏱️ The task ${taskName} already exists`);
      return;
    }
    // 执行任务 获取任务Id
    const taskId = this.executeTask(taskName, task, timeout, param);
    // 存储任务 Map("xxx",[id,taskFn])
    this.taskStack.set(taskName, [taskId, task]);
  }
  update() {}
  remove() {}

  /**
   * @description 监听任务 执行完成后触发回调
   * @param { string } taskName 需要监听的任务名称
   * @param { (param: any) => void } callback 执行完成后出发的回调 回传参数为create中的param
   */
  on(taskName: T, callback: (param: any) => void) {
    this.message[taskName] = callback;
  }

  /**
   * @description 执行任务
   * @param { string } taskName 任务名称
   * @param { () => void | Promise<void> } task 任务回调函数
   * @param { number } timeout 执行时间
   * @param { any } param 剩余参数，可用于on后回传
   * @returns { NodeJS.Timeout } 任务Id
   */
  private executeTask(
    taskName: string,
    task: () => void | Promise<void>,
    timeout: number = 0,
    param: any
  ): NodeJS.Timeout {
    const fullTask = async () => {
      await task();
      if (this.message[taskName]) this.message[taskName](param);
    };
    if (this.taskType === "Timeout") return setTimeout(fullTask, timeout);
    else return setInterval(fullTask, timeout);
  }
}
