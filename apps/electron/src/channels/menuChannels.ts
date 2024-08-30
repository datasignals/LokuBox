export enum MenuChannels {
  WINDOW_MINIMIZE = "window-minimize",
  WINDOW_MAXIMIZE = "window-maximize",
  WINDOW_TOGGLE_MAXIMIZE = "window-toggle-maximize",
  WINDOW_CLOSE = "window-close",
  WEB_TOGGLE_DEVTOOLS = "web-toggle-devtools",
  WEB_ACTUAL_SIZE = "web-actual-size",
  WEB_ZOOM_IN = "web-zoom-in",
  WEB_ZOOM_OUT = "web-zoom-out",
  WEB_TOGGLE_FULLSCREEN = "web-toggle-fullscreen",
  OPEN_GITHUB_PROFILE = "open-github-profile",
  MENU_EVENT = "menu-event",
  EXECUTE_MENU_ITEM_BY_ID = "execute-menu-item-by-id",
  SHOW_CONTEXT_MENU = "show-context-menu",

  //FS handling
  READ_DIR = "read-dir",
  READ_FILE = "read-file",

  CREATE_DIR = "create-dir",
  CREATE_FILE = "create-file",

  REMOVE_DIR_FILE = "remove-dir-file",

  MOUNT_NFS = "mount-nfs",
  UNMOUNT_NFS = "unmount-nfs",
  IS_NFS_MOUNTED = "is-nfs-mounted",

  SHARE_FILE = "share-file",
}
