export class AppConfig {

  public static readonly PRODUCTION: boolean = true;

  public static readonly ROUND_PROGRESS_COLOR: string = '#ffa3b9';

  public static readonly ROUND_PROGRESS_STROKE: number = 50;

  public static readonly LOADING_CONTENT: string = `
  <div class="logo">
    <img src="assets/imgs/ui_parts/logo.png" />
  </div>
  <div class="message">しんだんちゅうです</div>
  <div class="spinner">
    <div class="ball-pulse">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>`;

  public static readonly LOADING_DURATION: number = 3000;
}
