/**
 * 计时器
 */
export class Scheduler {
  /**
   * 自启动以来的总运行时间, 单位(s)
   * @private
   */
  private totalTime: number = 0;

  /**
   * 上次调度器执行的时间戳, 单位(s)
   * @private
   */
  private previousTime: number = 0;

  /**
   * 上次调度器执行的时间间隔, 单位(s)
   * @private
   */
  private deltaTime: number = 0;

  public init() {
    this.previousTime = Date.now() * 0.001;
  }

  /**
   * 执行一次调度器
   * 可以交给requestAnimation进行调度
   */
  public update(): void {
    const currentTime = Date.now() * 0.001;
    const dt = currentTime - this.previousTime;
    this.previousTime = currentTime;
    this.deltaTime = dt;
    this.totalTime += dt;
  }

  /**
   * 获取自启动以来的总运行时间, 单位(s)
   */
  public getTotalTime(): number {
    return this.totalTime;
  }

  /**
   * 获取上次执行的时间间隔, 单位(s)
   */
  public getDeltaTime(): number {
    return this.deltaTime;
  }
}
