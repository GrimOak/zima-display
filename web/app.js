const API = '/zima-display/api';
const LOCALE_STORAGE_KEY = 'zima-display.locale';
const translations = {
  'zh-CN': {
    'language.label': '语言', 'language.aria': '显示语言',
    'language.synced': 'Web 和 HDMI 已切换为简体中文',
    'status.connecting': '服务连接中', 'status.online': '服务在线', 'status.offline': '服务离线',
    'settings.open': '打开设置',
    'home.kicker': '开始使用', 'home.heading': '你想让屏幕显示什么？',
    'home.description': '先选择一种内容。页面只会展开完成这件事需要的工具。',
    'home.viewCurrent': '查看当前屏幕', 'home.chooseHeading': '选择内容类型',
    'home.chooseDescription': '三种方式互不干扰，一次只处理一种。',
    'home.choiceDashboard': '使用现成画面', 'home.choiceDashboardHint': '直接显示系统状态或时钟',
    'home.choiceCanvas': '设计自由画布', 'home.choiceCanvasHint': '从模板开始，再调整组件和背景',
    'home.choiceMedia': '播放照片或视频', 'home.choiceMediaHint': '选择文件、文件夹或网络地址',
    'home.presetHeading': '选择一个现成画面', 'home.presetDescription': '适合第一次使用，点击后立即显示到 HDMI。',
    'home.showNow': '立即显示', 'home.currentOutputHeading': '需要确认屏幕吗？',
    'home.currentOutputDescription': '远程操作、播放媒体或排查问题时再查看实时画面',
    'home.screenTools': '屏幕维护', 'home.screenToolsHint': '这些不是内容类型，只在暂停显示或恢复终端时使用。',
    'home.integrationHeading': '智能体与扩展', 'home.integrationDescription': '仅在需要 DeepSeek Harness 投屏能力时设置',
    'preview.liveOutput': '实时输出', 'preview.autoDetect': '自动检测',
    'preview.mediaFrame': '当前 HDMI 媒体画面',
    'preview.hdmiOnline': 'HDMI 已连接', 'preview.waitingDisplay': '等待显示器连接',
    'preview.preferredMode': '首选分辨率',
    'player.nowPlaying': '当前内容', 'player.managed': 'HDMI 输出由 Zima Display 管理',
    'player.error': '错误：{message}', 'player.previous': '上一个', 'player.pause': '暂停',
    'player.resume': '继续播放', 'player.next': '下一个', 'player.stop': '停止',
    'player.progress': '播放进度', 'player.volume': 'HDMI 音量',
    'modes.heading': '输出模式', 'modes.hint': '一键切换 HDMI 内容',
    'modes.dashboard': '系统仪表盘', 'modes.dashboardHint': '性能、存储与网络',
    'modes.canvas': '自由画布', 'modes.canvasHint': '自定义组件、位置与背景',
    'modes.clock': '环境时钟', 'modes.clockHint': '低干扰常亮信息',
    'modes.black': '黑屏待机', 'modes.blackHint': '播放器保持在线',
    'modes.terminal': '恢复终端', 'modes.systemTerminal': '系统终端',
    'modes.terminalHint': '释放 HDMI 与 TTY1', 'modes.video': '媒体播放', 'modes.slideshow': '图片轮播', 'modes.unknown': '未知模式',
    'modes.presentation': '文档投屏',
    'modePreview.dashboard': '系统仪表盘', 'modePreview.clock': '环境时钟',
    'modePreview.canvas': '自由画布',
    'modePreview.black': '黑屏待机', 'modePreview.terminal': '系统终端',
    'modePreview.video': '媒体播放', 'modePreview.slideshow': '图片轮播', 'modePreview.presentation': '文档投屏', 'modePreview.unknown': '未知模式',
    'metrics.aria': '系统指标', 'metrics.cpu': 'CPU 负载', 'metrics.load': '负载 {value}',
    'metrics.memory': '内存', 'metrics.storage': '存储', 'metrics.network': '网络',
    'metrics.thermal': '温度 / GPU', 'metrics.waitingNetwork': '等待网络',
    'metrics.autoGraphics': '自动检测图形设备',
    'dashboard.editorKicker': '仪表盘编辑', 'dashboard.editorHeading': '调整系统仪表盘',
    'dashboard.editorDescription': '修改标题、布局和字号。保存前只影响这里的预览。',
    'dashboard.save': '保存设置', 'dashboard.apply': '保存并投到 HDMI',
    'dashboard.saved': '仪表盘设置已保存', 'dashboard.applied': '仪表盘设置已保存并投到 HDMI',
    'canvas.kicker': '布局工作室', 'canvas.heading': '自由画布',
    'canvas.description': '先选模板，再拖动组件调整。保存前不会改变 HDMI。',
    'canvas.save': '保存布局', 'canvas.apply': '保存并投到 HDMI',
    'canvas.templateHeading': '从模板开始', 'canvas.templateDescription': '模板只提供起点，应用后仍可自由修改。',
    'canvas.template': '布局模板', 'canvas.templateOverview': '系统概览',
    'canvas.templateClock': '巨型时钟', 'canvas.templateMinimal': '极简状态',
    'canvas.useTemplate': '应用模板', 'canvas.backgroundType': '背景类型',
    'canvas.backgroundSolid': '纯色', 'canvas.backgroundGradient': '渐变', 'canvas.backgroundImage': '图片',
    'canvas.primaryColor': '主色', 'canvas.secondaryColor': '辅色', 'canvas.backgroundPath': '背景图片',
    'canvas.uploadBackground': '上传背景图片', 'canvas.addWidget': '添加组件',
    'canvas.inspector': '所选组件', 'canvas.text': '文字', 'canvas.source': '数据来源', 'canvas.sourceHint': '本机或设置中添加的远程设备', 'canvas.sourceLocal': '本机', 'canvas.fontSize': '字号',
    'canvas.textColor': '文字颜色', 'canvas.bold': '粗体', 'canvas.removeWidget': '删除组件',
    'canvas.savedState': '已保存', 'canvas.unsavedState': '未保存', 'canvas.saved': '自由画布已保存',
    'canvas.applied': '自由画布已保存并投到 HDMI', 'canvas.selectWidget': '请先选择一个组件',
    'canvas.widget.clock': '时钟', 'canvas.widget.date': '日期', 'canvas.widget.cpu': 'CPU',
    'canvas.widget.memory': '内存', 'canvas.widget.storage': '存储', 'canvas.widget.temperature': '温度',
    'canvas.widget.network': '网络速率', 'canvas.widget.ip': 'IP 地址',
    'canvas.widget.hostname': '主机名', 'canvas.widget.text': '自定义文字',
    'media.kicker': '媒体播放', 'media.heading': '选择要播放的内容',
    'media.description': '选择文件后播放；这里不会同时显示自由画布工具。',
    'media.upload': '上传媒体', 'media.uploads': '上传媒体', 'media.playSelected': '播放已选',
    'media.networkMedia': '网络媒体', 'media.urlPlaceholder': 'https://... 或 rtsp://...',
    'media.playNow': '立即播放', 'media.parent': '返回上级', 'media.root': '媒体根目录',
    'media.refresh': '刷新', 'media.loading': '正在读取媒体目录...',
    'media.empty': '这个目录里还没有可播放的媒体', 'media.select': '选择 {name}',
    'media.kind.directory': '文件夹', 'media.kind.root': '根目录',
    'media.kind.video': '视频', 'media.kind.image': '图片',
    'media.play': '播放', 'media.open': '打开', 'media.playing': '正在播放 {name}',
    'media.openingNetwork': '正在打开网络媒体', 'media.loaded': '已载入 {count} 个媒体',
    'media.interval': '每张停留', 'media.intervalAria': '每张图片停留时间',
    'media.playDirectory': '轮播此目录', 'media.slideshowStarted': '正在循环播放 {count} 张图片，每张 {seconds} 秒',
    'media.uploading': '正在上传 {name}', 'media.uploaded': '{name} 上传完成',
    'dsh.kicker': '智能体集成', 'dsh.heading': 'DeepSeek Harness',
    'dsh.description': '自动发现 ZimaOS 商店版 DSH，并安装持久化投屏 Skill。无需进入容器。',
    'dsh.checking': '正在检查 DSH...', 'dsh.missing': '未检测到正在运行的 DSH 商店容器',
    'dsh.ready': 'DSH 已就绪，可以安装投屏 Skill', 'dsh.installed': 'Skill {version} 已安装',
    'dsh.converterInstalling': 'Skill 已安装，正在后台安装 PPT/PDF 转换组件',
    'dsh.converterMissing': 'Skill 已安装，PPT/PDF 转换组件需要修复',
    'dsh.install': '一键安装 Skill', 'dsh.update': '更新 Skill',
    'dsh.installing': '正在安装 DSH Skill...', 'dsh.completed': 'DSH Skill 安装完成，刷新 DSH 页面即可使用',
    'dsh.retrying': '检测接口暂不可用，5 秒后自动重试',
    'settings.kicker': '设备设置', 'settings.heading': '设置',
    'settings.subtitle': '管理开机行为、显示输出、媒体播放和远程数据。',
    'settings.deviceNow': '当前输出', 'settings.categories': '设置分类',
    'settings.connector': '接口', 'settings.currentMode': '正在显示',
    'settings.deviceConnected': '显示器已连接', 'settings.deviceDisconnected': '等待显示器',
    'settings.rendererReady': '渲染器在线', 'settings.rendererUnavailable': '渲染器未就绪',
    'settings.navGeneral': '显示与启动', 'settings.navGeneralHint': '开机内容、输出方式',
    'settings.navDashboard': '仪表盘外观', 'settings.navDashboardHint': '标题、布局和字号',
    'settings.navAdvanced': '媒体与高级', 'settings.navAdvancedHint': '目录和音频设备',
    'settings.sidebarNote': '推荐保持 DRM、自动分辨率和自动音频。只有遇到兼容问题时再修改。',
    'settings.generalHeading': '开机行为', 'settings.generalDescription': '设置设备重启后的 HDMI 行为；修改默认画面不会立即切换当前内容。',
    'settings.startupHeading': '开机行为', 'settings.startupDescription': '让设备启动后直接进入常用画面。',
    'settings.defaultMode': '默认画面', 'settings.defaultModeHint': '仅在开启“开机自动显示”时使用；保存不会立即切换当前内容。',
    'settings.defaultContentGroup': '常用画面', 'settings.defaultMaintenanceGroup': '特殊启动',
    'settings.outputHeading': 'HDMI 输出方式', 'settings.outputDescription': 'DRM 是 ZimaOS 设备的首选路径；其他选项用于兼容性排查。',
    'settings.backend': '显示后端',
    'settings.backendAuto': '自动：Wayland / DRM 回退', 'settings.backendWayland': '仅 Wayland',
    'settings.backendDrm': '仅 DRM', 'settings.backendDrmDescription': '直接输出到 HDMI，启动链路最短，适合 Intel / AMD 设备。',
    'settings.backendAutoDescription': '先尝试 Wayland，再回退到 DRM；启动时间可能更长。',
    'settings.backendWaylandDescription': '只在已确认 Weston / Wayland 可用时选择。',
    'settings.recommended': '推荐', 'settings.advanced': '高级',
    'settings.resolution': '输出分辨率', 'settings.resolutionAuto': '自动（显示器首选）',
    'settings.resolutionHint': '自动会采用显示器报告的首选模式。',
    'settings.restartRequired': '这些修改需要重启显示', 'settings.restartRequiredHint': '保存不会打断当前画面，将在下次显示服务启动时生效。',
    'settings.audioDevice': 'HDMI 音频设备', 'settings.audioDeviceHint': '保持 auto；只有排查无声问题时填写 mpv 音频设备名。',
    'settings.audioHeading': 'HDMI 音频', 'settings.audioDescription': '自动模式适合大多数电视和显示器。',
    'settings.dashboardLanguage': '显示语言', 'settings.dashboardTitle': '仪表盘标题',
    'settings.dashboardTitleHint': '显示在仪表盘左上方。', 'settings.dashboardLanguageHint': '同时作为 Web 控制页的语言。',
    'settings.dashboardLayout': '仪表盘布局', 'settings.layoutAuto': '自动适配',
    'settings.layoutStandard': '标准布局', 'settings.layoutLarge': '大字布局',
    'settings.dashboardLayoutHint': '自动会根据显示器尺寸选择更易读的布局。',
    'settings.fontScale': '字体大小', 'settings.fontScaleHint': '大字号会自动降低超大数字的缩放幅度，避免内容互相遮挡。',
    'settings.previewHeading': '仪表盘预览', 'settings.previewHint': '使用与 HDMI 相同的场景数据和坐标。',
    'settings.previewResolution': '预览分辨率', 'settings.previewCurrent': '当前显示器',
    'settings.resetDashboard': '恢复仪表盘默认',
    'settings.advancedHeading': '媒体与高级', 'settings.advancedDescription': '通常无需修改；错误的路径或设备名会导致媒体不可见或 HDMI 无声。',
    'settings.troubleshootingHeading': '显示输出', 'settings.troubleshootingDescription': 'HDMI 输出方式、分辨率和音频设备',
    'settings.mediaHeading': '媒体播放', 'settings.mediaDescription': '播放结束行为、图片轮播和可访问目录',
    'settings.singleVideoEnd': '单个视频播放结束', 'settings.singleVideoRepeat': '重新播放', 'settings.singleVideoStop': '停在结束位置',
    'settings.singleVideoEndHint': '播放单个视频文件时使用。',
    'settings.collectionEnd': '目录或播放列表结束', 'settings.collectionRepeat': '从第一项重新开始', 'settings.collectionStop': '播放完最后一项后停止',
    'settings.collectionEndHint': '适用于多选文件和图片目录轮播。',
    'settings.slideshowInterval': '图片轮播默认停留', 'settings.slideshowIntervalHint': '媒体页可以为本次播放临时调整。',
    'settings.mediaRoots': '媒体目录',
    'settings.mediaRootsDescription': '控制文件浏览器可以访问的范围',
    'settings.mediaRootsHint': '每行一个目录，仅允许 /DATA、/media、/mnt 下的路径。',
    'settings.sourcesHeading': '远程设备数据', 'settings.sourcesDescription': '通过 SSH 为自由画布提供 CPU、内存、网络等数据',
    'settings.sourceName': '设备名称', 'settings.sourceHost': 'IP / 主机名', 'settings.sourcePort': 'SSH 端口', 'settings.sourceUser': 'SSH 用户', 'settings.sourcePassword': 'SSH 密码',
    'settings.sourceAdd': '测试连接并添加', 'settings.sourceAdding': '正在测试 SSH 并采集数据...', 'settings.sourceAdded': '远程设备已添加', 'settings.sourceRemoved': '远程设备已删除',
    'settings.sourceSecurity': '密码仅保存在设备本机的受限文件中，不会返回到浏览器。首次连接会记录 SSH 主机指纹。',
    'settings.sourceEmpty': '还没有远程设备。添加后可在自由画布组件中选择。', 'settings.sourceOnline': '在线', 'settings.sourceOffline': '离线', 'settings.sourceDelete': '删除',
    'settings.maintenanceHeading': '屏幕维护', 'settings.maintenanceDescription': '仅在暂停输出或恢复系统终端时使用',
    'settings.autoStart': '开机自动显示', 'settings.autoStartHint': '关闭后，设备开机时保留系统终端',
    'settings.notLoaded': '配置尚未加载',
    'settings.saved': '设置已保存',
    'settings.applied': '设置已保存',
    'settings.applyDisplay': '保存设置', 'settings.applyHint': '保存不会切换当前内容；输出方式和分辨率在下次重启显示时生效。',
    'settings.unsaved': '有未保存的更改', 'settings.noChanges': '没有待保存的修改', 'settings.changesPending': '设置已修改，尚未保存',
    'settings.aboutKicker': '关于', 'settings.aboutHeading': 'Zima Display',
    'settings.aboutDescription': '查看当前版本、源代码和问题反馈入口。', 'settings.version': '版本',
    'settings.switched': '已切换到{mode}',
    'common.close': '关闭', 'common.cancel': '取消', 'common.save': '保存设置'
  },
  'en-US': {
    'language.label': 'LANGUAGE', 'language.aria': 'Display language',
    'language.synced': 'Web and HDMI switched to English',
    'status.connecting': 'Connecting', 'status.online': 'Service online', 'status.offline': 'Service offline',
    'settings.open': 'Open settings',
    'home.kicker': 'GET STARTED', 'home.heading': 'What do you want the screen to show?',
    'home.description': 'Choose one content type first. Only the tools needed for that task will open.',
    'home.viewCurrent': 'View current screen', 'home.chooseHeading': 'Choose a content type',
    'home.chooseDescription': 'The three paths stay separate so you can focus on one task at a time.',
    'home.choiceDashboard': 'Use a ready-made view', 'home.choiceDashboardHint': 'Show system status or a clock immediately',
    'home.choiceCanvas': 'Design a free canvas', 'home.choiceCanvasHint': 'Start with a template, then adjust widgets and background',
    'home.choiceMedia': 'Play photos or video', 'home.choiceMediaHint': 'Choose files, a folder or a network address',
    'home.presetHeading': 'Choose a ready-made view', 'home.presetDescription': 'Best for first use. Click one to show it on HDMI now.',
    'home.showNow': 'Show now', 'home.currentOutputHeading': 'Need to confirm the screen?',
    'home.currentOutputDescription': 'Open the live view only for remote operation, media playback or troubleshooting',
    'home.screenTools': 'Screen maintenance', 'home.screenToolsHint': 'These are not content types. Use them only to pause output or restore the terminal.',
    'home.integrationHeading': 'Agents and extensions', 'home.integrationDescription': 'Set this up only when you need DeepSeek Harness display support',
    'preview.liveOutput': 'LIVE OUTPUT', 'preview.autoDetect': 'AUTO DETECT',
    'preview.mediaFrame': 'Current HDMI media frame',
    'preview.hdmiOnline': 'HDMI ONLINE', 'preview.waitingDisplay': 'Waiting for display',
    'preview.preferredMode': 'Preferred mode',
    'player.nowPlaying': 'NOW PLAYING', 'player.managed': 'HDMI output is managed by Zima Display',
    'player.error': 'Error: {message}', 'player.previous': 'Previous', 'player.pause': 'Pause',
    'player.resume': 'Resume', 'player.next': 'Next', 'player.stop': 'Stop',
    'player.progress': 'Playback progress', 'player.volume': 'HDMI VOLUME',
    'modes.heading': 'OUTPUT MODE', 'modes.hint': 'Switch HDMI content instantly',
    'modes.dashboard': 'System dashboard', 'modes.dashboardHint': 'Performance, storage and network',
    'modes.canvas': 'Free canvas', 'modes.canvasHint': 'Custom widgets, positions and backgrounds',
    'modes.clock': 'Ambient clock', 'modes.clockHint': 'Always-on, low-distraction view',
    'modes.black': 'Black standby', 'modes.blackHint': 'Keep the renderer online',
    'modes.terminal': 'Restore terminal', 'modes.systemTerminal': 'System terminal',
    'modes.terminalHint': 'Release HDMI and TTY1', 'modes.video': 'Media playback', 'modes.slideshow': 'Image slideshow',
    'modes.presentation': 'Presentation',
    'modes.unknown': 'Unknown mode',
    'modePreview.dashboard': 'SYSTEM DASHBOARD', 'modePreview.clock': 'AMBIENT CLOCK',
    'modePreview.canvas': 'FREE CANVAS',
    'modePreview.black': 'BLACK STANDBY', 'modePreview.terminal': 'SYSTEM TERMINAL',
    'modePreview.video': 'MEDIA PLAYBACK', 'modePreview.slideshow': 'IMAGE SLIDESHOW', 'modePreview.presentation': 'PRESENTATION', 'modePreview.unknown': 'UNKNOWN MODE',
    'metrics.aria': 'System metrics', 'metrics.cpu': 'CPU LOAD', 'metrics.load': 'Load {value}',
    'metrics.memory': 'MEMORY', 'metrics.storage': 'STORAGE', 'metrics.network': 'NETWORK',
    'metrics.thermal': 'THERMAL / GPU', 'metrics.waitingNetwork': 'Waiting for network',
    'metrics.autoGraphics': 'Automatic graphics detection',
    'dashboard.editorKicker': 'DASHBOARD EDITOR', 'dashboard.editorHeading': 'Customize the system dashboard',
    'dashboard.editorDescription': 'Adjust the title, layout and type size. Changes stay in this preview until saved.',
    'dashboard.save': 'Save settings', 'dashboard.apply': 'Save and show on HDMI',
    'dashboard.saved': 'Dashboard settings saved', 'dashboard.applied': 'Dashboard settings saved and shown on HDMI',
    'canvas.kicker': 'LAYOUT STUDIO', 'canvas.heading': 'Free canvas',
    'canvas.description': 'Choose a template, then drag widgets to adjust it. HDMI stays unchanged until saved.',
    'canvas.save': 'Save layout', 'canvas.apply': 'Save and show on HDMI',
    'canvas.templateHeading': 'Start with a template', 'canvas.templateDescription': 'Templates are starting points and remain fully editable.',
    'canvas.template': 'Layout template', 'canvas.templateOverview': 'System overview',
    'canvas.templateClock': 'Giant clock', 'canvas.templateMinimal': 'Minimal status',
    'canvas.useTemplate': 'Apply template', 'canvas.backgroundType': 'Background type',
    'canvas.backgroundSolid': 'Solid', 'canvas.backgroundGradient': 'Gradient', 'canvas.backgroundImage': 'Image',
    'canvas.primaryColor': 'Primary color', 'canvas.secondaryColor': 'Secondary color', 'canvas.backgroundPath': 'Background image',
    'canvas.uploadBackground': 'Upload background image', 'canvas.addWidget': 'Add widget',
    'canvas.inspector': 'Selected widget', 'canvas.text': 'Text', 'canvas.source': 'Data source', 'canvas.sourceHint': 'This device or a remote device added in Settings', 'canvas.sourceLocal': 'This device', 'canvas.fontSize': 'Font size',
    'canvas.textColor': 'Text color', 'canvas.bold': 'Bold', 'canvas.removeWidget': 'Remove widget',
    'canvas.savedState': 'SAVED', 'canvas.unsavedState': 'UNSAVED', 'canvas.saved': 'Free canvas saved',
    'canvas.applied': 'Free canvas saved and shown on HDMI', 'canvas.selectWidget': 'Select a widget first',
    'canvas.widget.clock': 'Clock', 'canvas.widget.date': 'Date', 'canvas.widget.cpu': 'CPU',
    'canvas.widget.memory': 'Memory', 'canvas.widget.storage': 'Storage', 'canvas.widget.temperature': 'Temperature',
    'canvas.widget.network': 'Network rate', 'canvas.widget.ip': 'IP address',
    'canvas.widget.hostname': 'Hostname', 'canvas.widget.text': 'Custom text',
    'media.kicker': 'MEDIA PLAYBACK', 'media.heading': 'Choose what to play',
    'media.description': 'Choose media and play it. Canvas editing stays out of this workflow.',
    'media.upload': 'Upload media', 'media.uploads': 'Uploads', 'media.playSelected': 'Play selected',
    'media.networkMedia': 'Network media', 'media.urlPlaceholder': 'https://... or rtsp://...',
    'media.playNow': 'Play now', 'media.parent': 'Go to parent folder', 'media.root': 'Media roots',
    'media.refresh': 'Refresh', 'media.loading': 'Loading media folders...',
    'media.empty': 'No playable media in this folder', 'media.select': 'Select {name}',
    'media.kind.directory': 'FOLDER', 'media.kind.root': 'ROOT',
    'media.kind.video': 'VIDEO', 'media.kind.image': 'IMAGE',
    'media.play': 'Play', 'media.open': 'Open', 'media.playing': 'Playing {name}',
    'media.openingNetwork': 'Opening network media', 'media.loaded': 'Loaded {count} media items',
    'media.interval': 'Hold each', 'media.intervalAria': 'Time to show each image',
    'media.playDirectory': 'Loop this folder', 'media.slideshowStarted': 'Looping {count} images at {seconds} seconds each',
    'media.uploading': 'Uploading {name}', 'media.uploaded': '{name} uploaded',
    'dsh.kicker': 'AGENT INTEGRATION', 'dsh.heading': 'DeepSeek Harness',
    'dsh.description': 'Automatically detect the ZimaOS Store DSH container and persistently install the display skill. No container shell required.',
    'dsh.checking': 'Checking DSH...', 'dsh.missing': 'No running DSH Store container detected',
    'dsh.ready': 'DSH is ready for the display skill', 'dsh.installed': 'Skill {version} is installed',
    'dsh.converterInstalling': 'Skill installed; PPT/PDF converters are installing in the background',
    'dsh.converterMissing': 'Skill installed; PPT/PDF converters need repair',
    'dsh.install': 'Install Skill', 'dsh.update': 'Update Skill',
    'dsh.installing': 'Installing the DSH skill...', 'dsh.completed': 'DSH skill installed. Refresh DSH to use it.',
    'dsh.retrying': 'Detection is temporarily unavailable; retrying in 5 seconds',
    'settings.kicker': 'DEVICE SETTINGS', 'settings.heading': 'Settings',
    'settings.subtitle': 'Manage startup behavior, display output, media playback and remote data.',
    'settings.deviceNow': 'CURRENT OUTPUT', 'settings.categories': 'Settings categories',
    'settings.connector': 'Connector', 'settings.currentMode': 'Now showing',
    'settings.deviceConnected': 'Display connected', 'settings.deviceDisconnected': 'Waiting for display',
    'settings.rendererReady': 'Renderer online', 'settings.rendererUnavailable': 'Renderer unavailable',
    'settings.navGeneral': 'Display & startup', 'settings.navGeneralHint': 'Startup content and output',
    'settings.navDashboard': 'Dashboard look', 'settings.navDashboardHint': 'Title, layout and type',
    'settings.navAdvanced': 'Media & advanced', 'settings.navAdvancedHint': 'Folders and audio device',
    'settings.sidebarNote': 'Keep DRM, automatic resolution and automatic audio unless you are troubleshooting a problem.',
    'settings.generalHeading': 'Startup behavior', 'settings.generalDescription': 'Set what HDMI does after a restart. Changing the default view does not switch the current content.',
    'settings.startupHeading': 'Startup behavior', 'settings.startupDescription': 'Open the device directly into the content you use most.',
    'settings.defaultMode': 'Default view', 'settings.defaultModeHint': 'Used only when Show automatically at startup is enabled. Saving does not immediately switch the current content.',
    'settings.defaultContentGroup': 'Common views', 'settings.defaultMaintenanceGroup': 'Special startup',
    'settings.outputHeading': 'HDMI output method', 'settings.outputDescription': 'DRM is preferred on ZimaOS hardware; use the other options for compatibility troubleshooting.',
    'settings.backend': 'Display backend',
    'settings.backendAuto': 'Auto: Wayland with DRM fallback', 'settings.backendWayland': 'Wayland only',
    'settings.backendDrm': 'DRM only', 'settings.backendDrmDescription': 'Outputs directly to HDMI with the shortest startup path. Recommended for Intel and AMD devices.',
    'settings.backendAutoDescription': 'Tries Wayland before DRM fallback, which can make startup slower.',
    'settings.backendWaylandDescription': 'Choose only when Weston and Wayland are known to work on this device.',
    'settings.recommended': 'RECOMMENDED', 'settings.advanced': 'ADVANCED',
    'settings.resolution': 'Output resolution', 'settings.resolutionAuto': 'Automatic (display preferred)',
    'settings.resolutionHint': 'Automatic uses the preferred mode reported by the display.',
    'settings.restartRequired': 'These changes require a display restart', 'settings.restartRequiredHint': 'Saving does not interrupt the current output; changes apply the next time the display service starts.',
    'settings.audioDevice': 'HDMI audio device', 'settings.audioDeviceHint': 'Keep auto unless troubleshooting missing sound with a specific mpv audio device.',
    'settings.audioHeading': 'HDMI audio', 'settings.audioDescription': 'Automatic mode works for most TVs and monitors.',
    'settings.dashboardLanguage': 'Display language', 'settings.dashboardTitle': 'Dashboard title',
    'settings.dashboardTitleHint': 'Shown at the upper left of the dashboard.', 'settings.dashboardLanguageHint': 'Also becomes the Web control language.',
    'settings.dashboardLayout': 'Dashboard layout', 'settings.layoutAuto': 'Automatic',
    'settings.layoutStandard': 'Standard layout', 'settings.layoutLarge': 'Large-type layout',
    'settings.dashboardLayoutHint': 'Automatic selects a more readable layout for the connected display size.',
    'settings.fontScale': 'Font size', 'settings.fontScaleHint': 'Very large values scale more gently to avoid overlapping nearby content.',
    'settings.previewHeading': 'Dashboard preview', 'settings.previewHint': 'Uses the same scene data and coordinates as HDMI.',
    'settings.previewResolution': 'Preview resolution', 'settings.previewCurrent': 'Current display',
    'settings.resetDashboard': 'Reset dashboard',
    'settings.advancedHeading': 'Media and advanced', 'settings.advancedDescription': 'Usually no changes are needed. Incorrect paths or device names can hide media or disable HDMI sound.',
    'settings.troubleshootingHeading': 'Display output', 'settings.troubleshootingDescription': 'HDMI output method, resolution and audio device',
    'settings.mediaHeading': 'Media playback', 'settings.mediaDescription': 'End behavior, slideshow timing and accessible folders',
    'settings.singleVideoEnd': 'When one video ends', 'settings.singleVideoRepeat': 'Play it again', 'settings.singleVideoStop': 'Stop at the end',
    'settings.singleVideoEndHint': 'Used when playing a single video file.',
    'settings.collectionEnd': 'When a folder or playlist ends', 'settings.collectionRepeat': 'Restart from the first item', 'settings.collectionStop': 'Stop after the last item',
    'settings.collectionEndHint': 'Used for selected files and image-folder slideshows.',
    'settings.slideshowInterval': 'Default time per image', 'settings.slideshowIntervalHint': 'The Media page can override this for one playback.',
    'settings.mediaRoots': 'Media folders',
    'settings.mediaRootsDescription': 'Controls which locations the file browser can access',
    'settings.mediaRootsHint': 'One folder per line. Paths must be under /DATA, /media or /mnt.',
    'settings.sourcesHeading': 'Remote device data', 'settings.sourcesDescription': 'Collect CPU, memory and network data over SSH for free-canvas widgets',
    'settings.sourceName': 'Device name', 'settings.sourceHost': 'IP / hostname', 'settings.sourcePort': 'SSH port', 'settings.sourceUser': 'SSH user', 'settings.sourcePassword': 'SSH password',
    'settings.sourceAdd': 'Test and add', 'settings.sourceAdding': 'Testing SSH and collecting data...', 'settings.sourceAdded': 'Remote device added', 'settings.sourceRemoved': 'Remote device removed',
    'settings.sourceSecurity': 'The password stays in a restricted file on this device and is never returned to the browser. The SSH host fingerprint is pinned on first connection.',
    'settings.sourceEmpty': 'No remote devices yet. Add one to select it from free-canvas widgets.', 'settings.sourceOnline': 'ONLINE', 'settings.sourceOffline': 'OFFLINE', 'settings.sourceDelete': 'Delete',
    'settings.maintenanceHeading': 'Screen maintenance', 'settings.maintenanceDescription': 'Use only to pause output or restore the system terminal',
    'settings.autoStart': 'Show automatically at startup',
    'settings.autoStartHint': 'Keep the system terminal at startup when disabled',
    'settings.notLoaded': 'Configuration has not loaded yet',
    'settings.saved': 'Settings saved',
    'settings.applied': 'Settings saved',
    'settings.applyDisplay': 'Save settings', 'settings.applyHint': 'Saving does not switch the current content. Output method and resolution apply after the next display restart.',
    'settings.unsaved': 'Unsaved changes', 'settings.noChanges': 'No changes to save', 'settings.changesPending': 'Settings changed and not yet saved',
    'settings.aboutKicker': 'ABOUT', 'settings.aboutHeading': 'Zima Display',
    'settings.aboutDescription': 'View the installed version, source code and issue tracker.', 'settings.version': 'Version',
    'settings.switched': 'Switched to {mode}',
    'common.close': 'Close', 'common.cancel': 'Cancel', 'common.save': 'Save settings'
  }
};

const state = {
  status: null, media: null, selected: new Set(), poll: null, volumeTimer: null,
  locale: detectLocale(), serviceOnline: null, pendingDashboardLocale: null,
  localeSync: Promise.resolve(), dshPoll: null, dashboardPreviewTimer: null,
  livePreviewSequence: 0, dashboardPreviewSequence: 0, canvasPreviewSequence: 0,
  canvasDraft: null, canvasDirty: false, selectedCanvasWidget: null, canvasDrag: null,
  dashboardDraft: null, dashboardDirty: false,
  settingsInitialSnapshot: '', activeWorkspace: null, workspaceSelectedManually: false,
  slideshowIntervalChanged: false
};

const $ = id => document.getElementById(id);
const $$ = selector => Array.from(document.querySelectorAll(selector));

function normalizeLocale(value) {
  return String(value || '').toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US';
}

function detectLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved) return normalizeLocale(saved);
  } catch (_) { /* storage can be disabled */ }
  return normalizeLocale(navigator.languages?.[0] || navigator.language || 'zh-CN');
}

function t(key, params = {}) {
  const template = translations[state.locale]?.[key] ?? translations['zh-CN'][key] ?? key;
  return Object.entries(params).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, replacement), template);
}

function applyTranslations() {
  document.documentElement.lang = state.locale;
  $$('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  $$('[data-i18n-label]').forEach(element => { element.setAttribute('label', t(element.dataset.i18nLabel)); });
  $$('[data-i18n-aria-label]').forEach(element => { element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel)); });
  $$('[data-i18n-placeholder]').forEach(element => { element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder)); });
  $$('[data-i18n-alt]').forEach(element => { element.setAttribute('alt', t(element.dataset.i18nAlt)); });
  $('languageSelect').value = state.locale;
}

function setLocale(locale, syncDashboard = false) {
  state.locale = normalizeLocale(locale);
  try { localStorage.setItem(LOCALE_STORAGE_KEY, state.locale); } catch (_) { /* storage can be disabled */ }
  applyTranslations();
  updateClock();
  if (state.serviceOnline !== null) setConnectionBadge(state.serviceOnline);
  if (state.status) renderStatus(state.status);
  if (state.media) renderMedia();
  if ($('dshInstallButton')) loadDSHIntegration();
  if ($('settingsDialog')?.open) {
    populateResolutionOptions();
    updateSettingsDeviceSummary();
    updateSettingsDirty();
  }
  if (syncDashboard) queueDashboardLocale(state.locale);
}

function queueDashboardLocale(locale) {
  if (!state.status?.config) {
    state.pendingDashboardLocale = locale;
    return;
  }
  state.localeSync = state.localeSync.catch(() => {}).then(() => persistDashboardLocale(locale));
}

async function persistDashboardLocale(locale) {
  const current = state.status?.config;
  if (!current || current.dashboard?.language === locale) return;
  const updated = JSON.parse(JSON.stringify(current));
  updated.dashboard.language = locale;
  try {
    const saved = await request('/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    if (state.status) state.status.config = saved;
    if (state.dashboardDraft) {
      if (state.dashboardDirty) {
        state.dashboardDraft.language = locale;
      } else {
        state.dashboardDraft = cloneDashboard(saved.dashboard);
      }
      $('dashboardLanguageInput').value = locale;
      scheduleDashboardPreview();
    }
    if (state.canvasDraft) {
      updateCanvasInspector();
      renderCanvasEditorPreview();
    }
    showToast(t('language.synced'));
  } catch (error) {
    showToast(error.message, true);
  }
}

async function request(path, options = {}) {
  const response = await fetch(API + path, options);
  let payload = null;
  try { payload = await response.json(); } catch (_) { /* empty response */ }
  if (!response.ok) throw new Error(payload?.error || `HTTP ${response.status}`);
  return payload;
}

function showToast(message, error = false) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.toggle('error', error);
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function setConnectionBadge(online) {
  state.serviceOnline = online;
  const badge = $('connectionBadge');
  badge.classList.toggle('offline', !online);
  badge.replaceChildren(document.createElement('i'), document.createTextNode(t(online ? 'status.online' : 'status.offline')));
}

function setText(id, value) { const element = $(id); if (element) element.textContent = value; }
function clamp(value, min, max) { return Math.min(max, Math.max(min, Number(value) || 0)); }
function setBar(id, value) { const element = $(id); if (element) element.style.width = `${clamp(value, 0, 100)}%`; }

function bgrToCSS(value) {
  const color = String(value || '000000').replace('#', '').padStart(6, '0').slice(-6);
  return `#${color.slice(4, 6)}${color.slice(2, 4)}${color.slice(0, 2)}`;
}

function scaleSceneStage(container) {
  const stage = container?.firstElementChild;
  if (!stage?.dataset.sceneWidth || !container.clientWidth || !container.clientHeight) return;
  const width = Number(stage.dataset.sceneWidth);
  const height = Number(stage.dataset.sceneHeight);
  const scale = Math.min(container.clientWidth / width, container.clientHeight / height);
  const left = (container.clientWidth - width * scale) / 2;
  const top = (container.clientHeight - height * scale) / 2;
  stage.dataset.sceneScale = scale;
  stage.dataset.sceneLeft = left;
  stage.dataset.sceneTop = top;
  stage.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
}

const sceneResizeObserver = typeof ResizeObserver === 'function'
  ? new ResizeObserver(entries => entries.forEach(entry => scaleSceneStage(entry.target)))
  : { observe() {} };

function renderScene(container, scene) {
  if (!container || !scene?.width || !scene?.height) return;
  const stage = document.createElement('div');
  stage.className = 'scene-stage';
  stage.dataset.sceneWidth = scene.width;
  stage.dataset.sceneHeight = scene.height;
  stage.style.width = `${scene.width}px`;
  stage.style.height = `${scene.height}px`;
  stage.style.backgroundColor = scene.transparent ? 'transparent' : bgrToCSS(scene.background);
  stage.style.backgroundImage = scene.background_image ? `url("${API}/media/content?path=${encodeURIComponent(scene.background_image)}")` : 'none';
  stage.style.backgroundSize = 'cover';
  stage.style.backgroundPosition = 'center';
  (scene.elements || []).forEach(item => {
    const element = document.createElement('div');
    element.className = `scene-element ${item.kind}`;
    element.dataset.sceneId = item.id || '';
    if (item.widget_id) {
      element.dataset.widgetId = item.widget_id;
      element.classList.add('canvas-widget');
      element.classList.toggle('selected', item.widget_id === state.selectedCanvasWidget);
    }
    element.style.left = `${item.x}px`;
    element.style.top = `${item.y}px`;
    element.style.width = `${item.width || 0}px`;
    element.style.height = `${item.height || 0}px`;
    element.style.color = bgrToCSS(item.color);
    element.style.opacity = item.opacity ?? 1;
    if (item.kind === 'rect') {
      element.style.background = bgrToCSS(item.color);
    } else if (item.kind === 'text') {
      element.textContent = item.text || '';
      element.style.fontSize = `${item.font_size || 16}px`;
      element.style.fontWeight = item.bold ? '800' : '400';
      element.style.textAlign = item.align || 'left';
    }
    stage.appendChild(element);
  });
  container.replaceChildren(stage);
  container.hidden = false;
  sceneResizeObserver.observe(container);
  requestAnimationFrame(() => scaleSceneStage(container));
}

function formatBytes(value, rate = false) {
  let number = Number(value) || 0;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  while (number >= 1024 && index < units.length - 1) { number /= 1024; index += 1; }
  const digits = index < 2 ? 0 : 1;
  return `${number.toFixed(digits)} ${units[index]}${rate ? '/s' : ''}`;
}

function formatTime(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const secs = value % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}` : `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function modeLabel(mode) { return t(`modePreview.${mode || 'unknown'}`); }
function modeTitle(mode) { return t(mode === 'terminal' ? 'modes.systemTerminal' : `modes.${mode || 'unknown'}`); }

function workspaceForMode(mode) {
  if (mode === 'canvas') return 'canvas';
  if (['video', 'slideshow', 'presentation'].includes(mode)) return 'media';
  return 'dashboard';
}

function setWorkspace(workspace, manual = true, scroll = true) {
  const selected = ['dashboard', 'canvas', 'media'].includes(workspace) ? workspace : 'dashboard';
  state.activeWorkspace = selected;
  if (manual) state.workspaceSelectedManually = true;
  $$('[data-workspace-choice]').forEach(button => {
    const active = button.dataset.workspaceChoice === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $$('[data-workspace-panel]').forEach(panel => { panel.hidden = panel.dataset.workspacePanel !== selected; });
  const panel = $(`${selected}Workspace`);
  if (selected === 'canvas' && state.canvasDraft) renderCanvasEditorPreview();
  if (scroll) panel?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
}

function updateClock() {
  const value = new Date().toLocaleTimeString(state.locale, { hour: '2-digit', minute: '2-digit', hour12: false });
  setText('headerClock', value);
  setText('previewClock', value);
}

async function loadLiveOutputPreview(mode) {
  const container = $('liveScenePreview');
  const mediaPreview = $('liveMediaPreview');
  if (!$('currentOutputDetails')?.open) return;
  const sequence = ++state.livePreviewSequence;
  if (['video', 'slideshow', 'presentation'].includes(mode)) {
    container.hidden = true;
    mediaPreview.onload = () => {
      if (sequence !== state.livePreviewSequence) return;
      mediaPreview.hidden = false;
      $('screenPreview').classList.add('scene-active');
    };
    mediaPreview.onerror = () => {
      if (sequence !== state.livePreviewSequence) return;
      mediaPreview.hidden = true;
      $('screenPreview').classList.remove('scene-active');
    };
    mediaPreview.src = `${API}/preview/frame?t=${Date.now()}`;
    return;
  }
  mediaPreview.hidden = true;
  mediaPreview.removeAttribute('src');
  if (mode !== 'dashboard' && mode !== 'canvas') {
    container.hidden = true;
    $('screenPreview').classList.remove('scene-active');
    return;
  }
  try {
    const scene = await request(`/preview/${mode}`);
    if (sequence !== state.livePreviewSequence) return;
    renderScene(container, scene);
    $('screenPreview').classList.add('scene-active');
  } catch (error) {
    console.error(error);
    container.hidden = true;
    $('screenPreview').classList.remove('scene-active');
  }
}

async function refreshStatus() {
  try {
    const data = await request('/status');
    state.status = data;
    renderStatus(data);
    setConnectionBadge(true);
    if (state.pendingDashboardLocale) {
      const locale = state.pendingDashboardLocale;
      state.pendingDashboardLocale = null;
      queueDashboardLocale(locale);
    }
  } catch (error) {
    setConnectionBadge(false);
    console.error(error);
  } finally {
    clearTimeout(state.poll);
    state.poll = setTimeout(refreshStatus, 2000);
  }
}

function renderStatus(data) {
  const metrics = data.metrics || {};
  const player = data.player || {};
  const config = data.config || {};
  const display = metrics.display || {};
  const gpu = metrics.gpu || {};
  const mode = player.mode || config.default_mode || 'dashboard';

  if (!state.slideshowIntervalChanged && config.media?.slideshow_interval_seconds) {
    $('slideshowInterval').value = String(config.media.slideshow_interval_seconds);
  }

  if (!state.workspaceSelectedManually) setWorkspace(workspaceForMode(mode), false, false);

  $$('.mode-button').forEach(button => button.classList.toggle('active', button.dataset.mode === mode));
  setText('previewMode', modeLabel(mode));
  setText('previewTitle', config.dashboard?.title || 'Zima Display');
  setText('connectorName', display.connector || t('preview.autoDetect'));
  setText('displayState', display.connected ? t('preview.hdmiOnline') : t('preview.waitingDisplay'));
  setText('displayMode', display.modes?.[0] || t('preview.preferredMode'));
  $('screenPreview').classList.toggle('offline', !display.connected);

  setText('mediaTitle', player.presentation?.title || player.media_title || modeTitle(mode));
  const presentationDetail = player.presentation ? `${player.presentation.page} / ${player.presentation.page_count}` : '';
  setText('mediaPath', presentationDetail || player.path || (player.last_error ? t('player.error', { message: player.last_error }) : t('player.managed')));
  setText('positionTime', formatTime(player.position_seconds));
  setText('durationTime', formatTime(player.duration_seconds));
  $('progressRange').value = player.duration_seconds ? clamp(player.position_seconds / player.duration_seconds * 100, 0, 100) : 0;
  $('playPauseButton').dataset.action = player.paused ? 'resume' : 'pause';
  $('playPauseButton').innerHTML = player.paused ? '&#9654;' : '&#10074;&#10074;';
  $('playPauseButton').setAttribute('aria-label', t(player.paused ? 'player.resume' : 'player.pause'));

  const volume = Math.round(player.renderer_ready ? player.volume : (config.volume ?? 70));
  if (document.activeElement !== $('volumeRange')) $('volumeRange').value = volume;
  setText('volumeValue', `${volume}%`);

  setText('cpuMetric', `${Math.round(metrics.cpu_percent || 0)}%`);
  setText('loadMetric', t('metrics.load', { value: (metrics.load_1 || 0).toFixed(2) }));
  setBar('cpuBar', metrics.cpu_percent);
  setText('memoryMetric', `${Math.round(metrics.memory_percent || 0)}%`);
  setText('memoryDetail', `${formatBytes(metrics.memory_used_bytes)} / ${formatBytes(metrics.memory_total_bytes)}`);
  setBar('memoryBar', metrics.memory_percent);
  setText('diskMetric', `${Math.round(metrics.disk_percent || 0)}%`);
  setText('diskDetail', `${formatBytes(metrics.disk_used_bytes)} / ${formatBytes(metrics.disk_total_bytes)}`);
  setBar('diskBar', metrics.disk_percent);
  setText('networkDown', formatBytes(metrics.network_rx_bps, true));
  setText('networkUp', formatBytes(metrics.network_tx_bps, true));
  setText('ipAddress', metrics.ip_addresses?.[0] || t('metrics.waitingNetwork'));
  setText('temperatureMetric', Math.round(metrics.temperature_c || gpu.temperature_c || 0));
  setText('gpuName', [gpu.vendor, gpu.name].filter(Boolean).join(' · ') || t('metrics.autoGraphics'));
  renderRemoteSources();
  hydrateDashboardEditor(config.dashboard);
  if (!state.canvasDraft) hydrateCanvasEditor(config.canvas);
  else updateCanvasInspector();
  loadLiveOutputPreview(mode);
}

function renderRemoteSources() {
  const container = $('remoteSourcesList');
  if (!container) return;
  const configured = state.status?.config?.sources || [];
  const statuses = new Map((state.status?.sources || []).map(source => [source.id, source]));
  if (!configured.length) {
    const empty = document.createElement('div');
    empty.className = 'remote-source-empty';
    empty.textContent = t('settings.sourceEmpty');
    container.replaceChildren(empty);
    return;
  }
  container.replaceChildren(...configured.map(source => {
    const status = statuses.get(source.id) || {};
    const row = document.createElement('div');
    row.className = 'remote-source-row';
    const copy = document.createElement('div');
    const name = document.createElement('b');
    name.textContent = source.name;
    const detail = document.createElement('small');
    detail.textContent = `${source.user}@${source.host}:${source.port || 22}${status.error ? ` · ${status.error}` : ''}`;
    copy.append(name, detail);
    const badge = document.createElement('span');
    badge.className = `source-state${status.online ? ' online' : ''}`;
    badge.textContent = t(status.online ? 'settings.sourceOnline' : 'settings.sourceOffline');
    const remove = document.createElement('button');
    remove.className = 'remote-source-delete';
    remove.type = 'button';
    remove.textContent = t('settings.sourceDelete');
    remove.addEventListener('click', () => deleteRemoteSource(source.id));
    row.append(copy, badge, remove);
    return row;
  }));
}

async function addRemoteSource() {
  const button = $('addRemoteSourceButton');
  const payload = {
    name: $('sourceNameInput').value.trim(), host: $('sourceHostInput').value.trim(),
    port: Number($('sourcePortInput').value) || 22, user: $('sourceUserInput').value.trim(),
    password: $('sourcePasswordInput').value, poll_interval_seconds: 5
  };
  button.disabled = true;
  showToast(t('settings.sourceAdding'));
  try {
    await request('/sources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    ['sourceNameInput', 'sourceHostInput', 'sourceUserInput', 'sourcePasswordInput'].forEach(id => { $(id).value = ''; });
    showToast(t('settings.sourceAdded'));
    await refreshStatus();
  } catch (error) {
    showToast(error.message, true);
  } finally {
    button.disabled = false;
  }
}

async function deleteRemoteSource(id) {
  try {
    await request(`/sources/${encodeURIComponent(id)}`, { method: 'DELETE' });
    showToast(t('settings.sourceRemoved'));
    await refreshStatus();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function loadDSHIntegration() {
  const button = $('dshInstallButton');
  clearTimeout(state.dshPoll);
  try {
    const status = await request('/integration/dsh');
    button.disabled = !status.available;
    button.dataset.installed = status.installed ? 'true' : 'false';
    button.textContent = t(status.installed ? 'dsh.update' : 'dsh.install');
    let message = status.installed ? t('dsh.installed', { version: status.version || '' }) : (status.available ? t('dsh.ready') : (status.error || t('dsh.missing')));
    if (status.installed && status.converter_state === 'installing') message = t('dsh.converterInstalling');
    if (status.installed && status.converter_state === 'missing') message = t('dsh.converterMissing');
    setText('dshState', message);
    if (status.converter_state === 'installing') state.dshPoll = setTimeout(loadDSHIntegration, 5000);
  } catch (error) {
    button.disabled = true;
    setText('dshState', error.message.includes('404') ? t('dsh.retrying') : error.message);
    state.dshPoll = setTimeout(loadDSHIntegration, 5000);
  }
}

async function installDSHSkill() {
  const button = $('dshInstallButton');
  button.disabled = true;
  showToast(t('dsh.installing'));
  try {
    const baseURL = `${window.location.origin}/zima-display`;
    await request('/integration/dsh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ base_url: baseURL }) });
    showToast(t('dsh.completed'));
    await loadDSHIntegration();
  } catch (error) {
    showToast(error.message, true);
    await loadDSHIntegration();
  }
}

async function action(payload, successMessage) {
  try {
    await request('/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (successMessage) showToast(successMessage);
    await refreshStatus();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function loadMedia(path = '') {
  try {
    const query = path ? `?path=${encodeURIComponent(path)}` : '';
    state.media = await request('/media' + query);
    state.selected.clear();
    renderMedia();
  } catch (error) {
    $('mediaList').innerHTML = '<div class="empty-state"></div>';
    $('mediaList').firstElementChild.textContent = error.message;
  }
}

function renderMedia() {
  const data = state.media || { entries: [] };
  const imageCount = data.entries?.filter(entry => entry.kind === 'image').length || 0;
  setText('currentPath', data.path || t('media.root'));
  $('parentButton').disabled = !data.parent && !data.path;
  $('parentButton').dataset.path = data.parent || '';
  $('playDirectoryButton').disabled = !data.path || imageCount === 0;
  $('playDirectoryButton').dataset.count = imageCount;
  const list = $('mediaList');
  list.replaceChildren();
  if (!data.entries?.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = t('media.empty');
    list.appendChild(empty);
    updateSelection();
    return;
  }
  data.entries.forEach(entry => {
    const row = document.createElement('div');
    row.className = 'media-row';
    const selectable = entry.kind === 'video' || entry.kind === 'image';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.disabled = !selectable;
    checkbox.setAttribute('aria-label', t('media.select', { name: entry.name }));
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) state.selected.add(entry.path); else state.selected.delete(entry.path);
      updateSelection();
    });
    const name = document.createElement('div');
    name.className = 'media-name';
    const strong = document.createElement('b');
    strong.textContent = entry.label === 'uploads' ? t('media.uploads') : entry.name;
    const small = document.createElement('small');
    small.textContent = entry.path;
    name.append(strong, small);
    const kind = document.createElement('span');
    kind.className = 'media-kind';
    kind.textContent = t(`media.kind.${entry.kind}`);
    const size = document.createElement('span');
    size.className = 'media-meta';
    size.textContent = selectable ? formatBytes(entry.size) : '--';
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'media-open';
    open.textContent = t(selectable ? 'media.play' : 'media.open');
    open.addEventListener('click', () => selectable ? action({ action: 'play', path: entry.path }, t('media.playing', { name: entry.name })) : loadMedia(entry.path));
    row.append(checkbox, name, kind, size, open);
    list.appendChild(row);
  });
  updateSelection();
}

function updateSelection() {
  setText('selectedCount', state.selected.size);
  $('playSelectedButton').disabled = state.selected.size === 0;
}

function canvasTemplate(name) {
  const base = { background_type: 'gradient', background_color: '#151411', secondary_color: '#30251d', background_image: '', widgets: [] };
  if (name === 'clock') {
    base.background_color = '#101514';
    base.secondary_color = '#18362d';
    base.widgets = [
      { id: 'clock', type: 'clock', x: 100, y: 190, width: 1720, height: 360, font_size: 300, color: '#f7f3ea', bold: true },
      { id: 'date', type: 'date', x: 120, y: 600, width: 1500, height: 100, font_size: 64, color: '#86d2b7', bold: false },
      { id: 'ip', type: 'ip', x: 125, y: 900, width: 1000, height: 60, font_size: 34, color: '#b9b5ac', bold: false }
    ];
  } else if (name === 'minimal') {
    base.background_type = 'solid';
    base.background_color = '#151411';
    base.widgets = [
      { id: 'hostname', type: 'hostname', x: 90, y: 80, width: 1100, height: 100, font_size: 72, color: '#f26618', bold: true },
      { id: 'cpu', type: 'cpu', x: 90, y: 700, width: 430, height: 100, font_size: 64, color: '#f7f3ea', bold: true },
      { id: 'memory', type: 'memory', x: 610, y: 700, width: 500, height: 100, font_size: 64, color: '#f7f3ea', bold: true },
      { id: 'temperature', type: 'temperature', x: 1200, y: 700, width: 620, height: 100, font_size: 64, color: '#f7f3ea', bold: true },
      { id: 'ip', type: 'ip', x: 90, y: 930, width: 900, height: 60, font_size: 34, color: '#8c8982', bold: false }
    ];
  } else {
    base.widgets = [
      { id: 'clock', type: 'clock', x: 90, y: 70, width: 760, height: 210, font_size: 180, color: '#f7f3ea', bold: true },
      { id: 'date', type: 'date', x: 100, y: 290, width: 720, height: 70, font_size: 38, color: '#b9b5ac', bold: false },
      { id: 'cpu', type: 'cpu', x: 1040, y: 100, width: 360, height: 100, font_size: 64, color: '#f26618', bold: true },
      { id: 'memory', type: 'memory', x: 1040, y: 230, width: 420, height: 100, font_size: 58, color: '#f7f3ea', bold: true },
      { id: 'temperature', type: 'temperature', x: 1040, y: 360, width: 420, height: 100, font_size: 58, color: '#f7f3ea', bold: true },
      { id: 'ip', type: 'ip', x: 100, y: 900, width: 900, height: 70, font_size: 36, color: '#f7f3ea', bold: true },
      { id: 'hostname', type: 'hostname', x: 1040, y: 900, width: 700, height: 70, font_size: 36, color: '#b9b5ac', bold: false }
    ];
  }
  return base;
}

function cloneCanvas(canvas) {
  return JSON.parse(JSON.stringify(canvas || canvasTemplate('overview')));
}

function setCanvasDirty(dirty = true) {
  state.canvasDirty = dirty;
  const label = $('canvasDirtyState');
  label.textContent = t(dirty ? 'canvas.unsavedState' : 'canvas.savedState');
  label.classList.toggle('dirty', dirty);
}

function hydrateCanvasEditor(canvas) {
  if (state.canvasDraft && state.canvasDirty) return;
  state.canvasDraft = cloneCanvas(canvas);
  state.selectedCanvasWidget = null;
  $('canvasBackgroundTypeInput').value = state.canvasDraft.background_type || 'gradient';
  $('canvasBackgroundColorInput').value = state.canvasDraft.background_color || '#151411';
  $('canvasSecondaryColorInput').value = state.canvasDraft.secondary_color || '#30251d';
  $('canvasBackgroundImageInput').value = state.canvasDraft.background_image || '';
  setCanvasDirty(false);
  updateCanvasInspector();
  renderCanvasEditorPreview();
}

function selectedCanvasWidget() {
  return state.canvasDraft?.widgets?.find(widget => widget.id === state.selectedCanvasWidget) || null;
}

function updateCanvasInspector() {
  const widget = selectedCanvasWidget();
  $('canvasInspector').classList.toggle('disabled', !widget);
  $('canvasSourceField').hidden = !widget || !['cpu', 'memory', 'storage', 'temperature', 'network', 'ip', 'hostname'].includes(widget.type);
  if (!widget) return;
  const sourceSelect = $('canvasWidgetSourceInput');
  const statuses = new Map((state.status?.sources || []).map(source => [source.id, source]));
  const localOption = document.createElement('option');
  localOption.value = '';
  localOption.textContent = t('canvas.sourceLocal');
  const remoteOptions = (state.status?.config?.sources || []).map(source => {
    const option = document.createElement('option');
    option.value = source.id;
    option.textContent = `${source.name} · ${t(statuses.get(source.id)?.online ? 'settings.sourceOnline' : 'settings.sourceOffline')}`;
    return option;
  });
  sourceSelect.replaceChildren(localOption, ...remoteOptions);
  sourceSelect.value = widget.source_id || '';
  $('canvasWidgetTextInput').value = widget.type === 'text' ? (widget.text || '') : t(`canvas.widget.${widget.type}`);
  $('canvasWidgetTextInput').disabled = widget.type !== 'text';
  $('canvasWidgetXInput').value = widget.x;
  $('canvasWidgetYInput').value = widget.y;
  $('canvasWidgetWidthInput').value = widget.width;
  $('canvasWidgetHeightInput').value = widget.height;
  $('canvasWidgetFontInput').value = widget.font_size;
  $('canvasWidgetFontValue').textContent = `${widget.font_size}px`;
  $('canvasWidgetColorInput').value = widget.color;
  $('canvasWidgetBoldInput').checked = Boolean(widget.bold);
}

function selectCanvasWidget(id) {
  state.selectedCanvasWidget = id;
  const stage = $('canvasScenePreview').firstElementChild;
  stage?.querySelectorAll?.('.canvas-widget').forEach(element => element.classList.toggle('selected', element.dataset.widgetId === id));
  updateCanvasInspector();
}

function readCanvasBackgroundControls() {
  if (!state.canvasDraft) return;
  state.canvasDraft.background_type = $('canvasBackgroundTypeInput').value;
  state.canvasDraft.background_color = $('canvasBackgroundColorInput').value;
  state.canvasDraft.secondary_color = $('canvasSecondaryColorInput').value;
  state.canvasDraft.background_image = $('canvasBackgroundImageInput').value.trim();
  setCanvasDirty();
  scheduleCanvasPreview();
}

function scheduleCanvasPreview() {
  clearTimeout(state.canvasPreviewTimer);
  state.canvasPreviewTimer = setTimeout(renderCanvasEditorPreview, 100);
}

async function renderCanvasEditorPreview() {
  if (!state.canvasDraft) return;
  const sequence = ++state.canvasPreviewSequence;
  try {
    const scene = await request('/preview/canvas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ canvas: state.canvasDraft })
    });
    if (sequence !== state.canvasPreviewSequence) return;
    renderScene($('canvasScenePreview'), scene);
    selectCanvasWidget(state.selectedCanvasWidget);
  } catch (error) {
    showToast(error.message, true);
  }
}

function applyCanvasTemplate() {
  const template = $('canvasTemplateInput').value;
  state.canvasDraft = canvasTemplate(template);
  $$('[data-canvas-template]').forEach(button => button.classList.toggle('active', button.dataset.canvasTemplate === template));
  state.selectedCanvasWidget = state.canvasDraft.widgets[0]?.id || null;
  $('canvasBackgroundTypeInput').value = state.canvasDraft.background_type;
  $('canvasBackgroundColorInput').value = state.canvasDraft.background_color;
  $('canvasSecondaryColorInput').value = state.canvasDraft.secondary_color;
  $('canvasBackgroundImageInput').value = '';
  setCanvasDirty();
  updateCanvasInspector();
  renderCanvasEditorPreview();
}

function canvasWidgetDefaults(type) {
  const index = state.canvasDraft?.widgets?.length || 0;
  const x = 100 + (index % 4) * 120;
  const y = 120 + (index % 5) * 100;
  const sizes = { clock: 150, date: 42, cpu: 58, memory: 58, storage: 58, temperature: 58, network: 40, ip: 40, hostname: 48, text: 52 };
  return {
    id: `${type}-${Date.now().toString(36)}`, type, text: type === 'text' ? 'Zima Display' : '',
    x, y, width: type === 'clock' ? 700 : 520, height: type === 'clock' ? 190 : 90,
    font_size: sizes[type] || 48, color: type === 'cpu' ? '#f26618' : '#f7f3ea', bold: true
  };
}

function addCanvasWidget() {
  const widget = canvasWidgetDefaults($('canvasWidgetTypeInput').value);
  state.canvasDraft.widgets.push(widget);
  state.selectedCanvasWidget = widget.id;
  setCanvasDirty();
  updateCanvasInspector();
  renderCanvasEditorPreview();
}

function updateSelectedCanvasWidget() {
  const widget = selectedCanvasWidget();
  if (!widget) return;
  const x = clamp($('canvasWidgetXInput').value, 0, 1840);
  const y = clamp($('canvasWidgetYInput').value, 0, 1050);
  widget.x = Math.min(x, 1920 - 80);
  widget.y = Math.min(y, 1080 - 30);
  widget.width = clamp($('canvasWidgetWidthInput').value, 80, 1920 - widget.x);
  widget.height = clamp($('canvasWidgetHeightInput').value, 30, 1080 - widget.y);
  widget.font_size = clamp($('canvasWidgetFontInput').value, 12, 300);
  widget.color = $('canvasWidgetColorInput').value;
  widget.bold = $('canvasWidgetBoldInput').checked;
  widget.source_id = $('canvasSourceField').hidden ? '' : $('canvasWidgetSourceInput').value;
  if (widget.type === 'text') widget.text = $('canvasWidgetTextInput').value || 'Text';
  setCanvasDirty();
  updateCanvasInspector();
  scheduleCanvasPreview();
}

function removeCanvasWidget() {
  if (!state.selectedCanvasWidget) return showToast(t('canvas.selectWidget'), true);
  state.canvasDraft.widgets = state.canvasDraft.widgets.filter(widget => widget.id !== state.selectedCanvasWidget);
  state.selectedCanvasWidget = state.canvasDraft.widgets[0]?.id || null;
  setCanvasDirty();
  updateCanvasInspector();
  renderCanvasEditorPreview();
}

function canvasPoint(event) {
  const container = $('canvasScenePreview');
  const stage = container.firstElementChild;
  const bounds = container.getBoundingClientRect();
  const scale = Number(stage?.dataset.sceneScale) || 1;
  const left = Number(stage?.dataset.sceneLeft) || 0;
  const top = Number(stage?.dataset.sceneTop) || 0;
  return { x: (event.clientX - bounds.left - left) / scale, y: (event.clientY - bounds.top - top) / scale };
}

function beginCanvasDrag(event) {
  const target = event.target.closest?.('.canvas-widget');
  if (!target?.dataset.widgetId) return;
  $('canvasScenePreview').setPointerCapture?.(event.pointerId);
  selectCanvasWidget(target.dataset.widgetId);
  const widget = selectedCanvasWidget();
  const point = canvasPoint(event);
  const resize = Math.abs(point.x - (widget.x + widget.width)) < 42 && Math.abs(point.y - (widget.y + widget.height)) < 42;
  state.canvasDrag = { id: widget.id, resize, point, original: { x: widget.x, y: widget.y, width: widget.width, height: widget.height } };
  event.preventDefault();
}

function moveCanvasDrag(event) {
  if (!state.canvasDrag) return;
  const widget = selectedCanvasWidget();
  if (!widget || widget.id !== state.canvasDrag.id) return;
  const point = canvasPoint(event);
  const dx = Math.round(point.x - state.canvasDrag.point.x);
  const dy = Math.round(point.y - state.canvasDrag.point.y);
  if (state.canvasDrag.resize) {
    widget.width = clamp(state.canvasDrag.original.width + dx, 80, 1920 - widget.x);
    widget.height = clamp(state.canvasDrag.original.height + dy, 30, 1080 - widget.y);
  } else {
    widget.x = clamp(state.canvasDrag.original.x + dx, 0, 1920 - widget.width);
    widget.y = clamp(state.canvasDrag.original.y + dy, 0, 1080 - widget.height);
  }
  const element = Array.from($('canvasScenePreview').firstElementChild?.querySelectorAll?.('.canvas-widget') || []).find(item => item.dataset.widgetId === widget.id);
  if (element) {
    element.style.left = `${widget.x}px`;
    element.style.top = `${widget.y}px`;
    element.style.width = `${widget.width}px`;
    element.style.height = `${widget.height}px`;
  }
  updateCanvasInspector();
  event.preventDefault();
}

function endCanvasDrag(event) {
  if (!state.canvasDrag) return;
  const container = $('canvasScenePreview');
  if (container.hasPointerCapture?.(event.pointerId)) container.releasePointerCapture(event.pointerId);
  state.canvasDrag = null;
  setCanvasDirty();
  renderCanvasEditorPreview();
}

async function uploadCanvasBackground(file) {
  if (!file) return;
  const body = new FormData();
  body.append('file', file);
  try {
    const uploaded = await request('/upload', { method: 'POST', body });
    state.canvasDraft.background_type = 'image';
    state.canvasDraft.background_image = uploaded.path;
    $('canvasBackgroundTypeInput').value = 'image';
    $('canvasBackgroundImageInput').value = uploaded.path;
    setCanvasDirty();
    renderCanvasEditorPreview();
  } catch (error) {
    showToast(error.message, true);
  } finally {
    $('canvasBackgroundUploadInput').value = '';
  }
}

async function saveCanvas(apply = false) {
  if (!state.status?.config || !state.canvasDraft) return;
  const updated = JSON.parse(JSON.stringify(state.status.config));
  updated.canvas = cloneCanvas(state.canvasDraft);
  try {
    const saved = await request('/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    if (state.status) state.status.config = saved;
    state.canvasDraft = cloneCanvas(saved.canvas);
    setCanvasDirty(false);
    if (apply) await request('/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'mode', mode: 'canvas' }) });
    showToast(t(apply ? 'canvas.applied' : 'canvas.saved'));
    await refreshStatus();
  } catch (error) {
    showToast(error.message, true);
  }
}

function cloneDashboard(dashboard) {
  return JSON.parse(JSON.stringify(dashboard || { title: 'Zima Display', language: 'zh-CN', layout: 'auto', font_scale: 1, refresh_interval_ms: 1000 }));
}

function dashboardSettingsDraft() { return cloneDashboard(state.dashboardDraft); }

function hydrateDashboardEditor(dashboard) {
  if (state.dashboardDraft && state.dashboardDirty) return;
  const next = cloneDashboard(dashboard);
  if (state.dashboardDraft && JSON.stringify(state.dashboardDraft) === JSON.stringify(next)) return;
  state.dashboardDraft = next;
  $('dashboardTitleInput').value = state.dashboardDraft.title || 'Zima Display';
  $('dashboardLanguageInput').value = state.dashboardDraft.language || 'zh-CN';
  $('dashboardLayoutInput').value = state.dashboardDraft.layout || 'auto';
  $('fontScaleInput').value = Math.round((state.dashboardDraft.font_scale || 1) * 100);
  setDashboardDirty(false);
  scheduleDashboardPreview();
}

function readDashboardControls() {
  if (!state.dashboardDraft) return;
  state.dashboardDraft.title = $('dashboardTitleInput').value.trim() || 'Zima Display';
  state.dashboardDraft.language = $('dashboardLanguageInput').value || 'zh-CN';
  state.dashboardDraft.layout = $('dashboardLayoutInput').value || 'auto';
  state.dashboardDraft.font_scale = clamp(Number($('fontScaleInput').value) / 100, 0.8, 2);
  setDashboardDirty();
  scheduleDashboardPreview();
}

function setDashboardDirty(dirty = true) {
  state.dashboardDirty = dirty;
  $('saveDashboardButton').disabled = !dirty;
}

function updateFontScaleLabel() {
  setText('fontScaleValue', `${$('fontScaleInput').value}%`);
}

function selectedRendererBackend() {
  return $$('input[name="rendererBackend"]').find(input => input.checked)?.value || 'drm';
}

function settingsConfigDraft(current = state.status?.config) {
  if (!current) return null;
  const updated = JSON.parse(JSON.stringify(current));
  updated.default_mode = $('defaultModeInput').value;
  updated.renderer.backend = selectedRendererBackend();
  updated.renderer.resolution = $('resolutionInput').value || 'auto';
  updated.renderer.audio_device = $('audioDeviceInput').value.trim() || 'auto';
  updated.media = {
    single_video_end: $('singleVideoEndInput').value || 'repeat',
    collection_end: $('collectionEndInput').value || 'repeat',
    slideshow_interval_seconds: Number($('slideshowIntervalInput').value) || 8
  };
  updated.media_roots = $('mediaRootsInput').value.split('\n').map(value => value.trim()).filter(Boolean);
  updated.auto_start_display = $('autoStartInput').checked;
  updated.volume = Number($('volumeRange').value);
  return updated;
}

function settingsFingerprint(config) {
  if (!config) return '';
  return JSON.stringify({
    default_mode: config.default_mode,
    auto_start_display: config.auto_start_display,
    renderer: config.renderer,
    media: config.media,
    media_roots: config.media_roots
  });
}

function updateSettingsDirty() {
  if (!$('settingsDialog').open) return;
  const dirty = settingsFingerprint(settingsConfigDraft()) !== state.settingsInitialSnapshot;
  $('settingsDirtyBadge').hidden = !dirty;
  $('applySettingsButton').disabled = !dirty;
  setText('settingsSaveState', t(dirty ? 'settings.changesPending' : 'settings.noChanges'));
}

function populateResolutionOptions() {
  const select = $('resolutionInput');
  const configured = ($('settingsDialog').open && select.value) || state.status?.config?.renderer?.resolution || 'auto';
  const modes = new Set((state.status?.metrics?.display?.modes || []).filter(mode => /^\d+x\d+$/.test(mode)));
  if (configured !== 'auto') modes.add(configured);
  const option = (value, label) => {
    const element = document.createElement('option');
    element.value = value;
    element.textContent = label;
    return element;
  };
  select.replaceChildren(option('auto', t('settings.resolutionAuto')), ...Array.from(modes).map(mode => option(mode, mode.replace('x', ' × '))));
  select.value = configured;
}

function updateSettingsDeviceSummary() {
  const display = state.status?.metrics?.display || {};
  const player = state.status?.player || {};
  const displayState = t(display.connected ? 'settings.deviceConnected' : 'settings.deviceDisconnected');
  const rendererState = t(player.renderer_ready ? 'settings.rendererReady' : 'settings.rendererUnavailable');
  setText('settingsDeviceState', `${displayState} · ${rendererState}`);
  setText('settingsConnector', display.connector || '--');
  setText('settingsCurrentMode', modeTitle(player.mode || 'unknown'));
}

function scheduleDashboardPreview() {
  updateFontScaleLabel();
  clearTimeout(state.dashboardPreviewTimer);
  state.dashboardPreviewTimer = setTimeout(loadDashboardPreview, 120);
}

async function loadDashboardPreview() {
  if (!state.dashboardDraft) return;
  const sequence = ++state.dashboardPreviewSequence;
  try {
    const scene = await request('/preview/dashboard', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dashboard: dashboardSettingsDraft(), resolution: $('previewResolutionInput').value })
    });
    if (sequence === state.dashboardPreviewSequence) renderScene($('dashboardScenePreview'), scene);
  } catch (error) {
    showToast(error.message, true);
  }
}

function resetDashboardSettings() {
  state.dashboardDraft = {
    title: 'Zima Display', language: state.locale, layout: 'auto', font_scale: 1,
    refresh_interval_ms: state.status?.config?.dashboard?.refresh_interval_ms || 1000
  };
  $('dashboardTitleInput').value = state.dashboardDraft.title;
  $('dashboardLanguageInput').value = state.dashboardDraft.language;
  $('dashboardLayoutInput').value = state.dashboardDraft.layout;
  $('fontScaleInput').value = '100';
  setDashboardDirty();
  scheduleDashboardPreview();
}

async function saveDashboard(apply = false) {
  if (!state.status?.config || !state.dashboardDraft) return;
  const updated = JSON.parse(JSON.stringify(state.status.config));
  updated.dashboard = dashboardSettingsDraft();
  try {
    const saved = await request('/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    if (state.status) state.status.config = saved;
    state.dashboardDraft = cloneDashboard(saved.dashboard);
    setDashboardDirty(false);
    setLocale(saved.dashboard?.language || state.locale);
    if (apply) await request('/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'mode', mode: 'dashboard' }) });
    showToast(t(apply ? 'dashboard.applied' : 'dashboard.saved'));
    await refreshStatus();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function loadAboutInfo() {
  try {
    const health = await request('/health');
    setText('appVersion', health.version || '--');
  } catch (_) {
    setText('appVersion', '--');
  }
}

function openSettings() {
  const config = state.status?.config;
  if (!config) return showToast(t('settings.notLoaded'), true);
  $('defaultModeInput').value = config.default_mode;
  $$('input[name="rendererBackend"]').forEach(input => { input.checked = input.value === (config.renderer?.backend || 'drm'); });
  $('audioDeviceInput').value = config.renderer?.audio_device || 'auto';
  $('singleVideoEndInput').value = config.media?.single_video_end || 'repeat';
  $('collectionEndInput').value = config.media?.collection_end || 'repeat';
  $('slideshowIntervalInput').value = String(config.media?.slideshow_interval_seconds || 8);
  $('mediaRootsInput').value = (config.media_roots || ['/DATA']).join('\n');
  $('autoStartInput').checked = Boolean(config.auto_start_display);
  populateResolutionOptions();
  state.settingsInitialSnapshot = settingsFingerprint(config);
  $('settingsDialog').showModal();
  updateSettingsDeviceSummary();
  updateSettingsDirty();
  loadAboutInfo();
}

function closeSettings() {
  $('settingsDialog').close();
  state.settingsInitialSnapshot = '';
}

async function saveSettings(event) {
  event.preventDefault();
  const current = state.status?.config;
  if (!current) return;
  const updated = settingsConfigDraft(current);
  try {
    const saved = await request('/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    if (state.status) state.status.config = saved;
    setLocale(saved.dashboard?.language || state.locale);
    state.settingsInitialSnapshot = settingsFingerprint(saved);
    closeSettings();
    showToast(t('settings.saved'));
    await refreshStatus();
    await loadMedia();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function upload(file) {
  if (!file) return;
  const body = new FormData();
  body.append('file', file);
  showToast(t('media.uploading', { name: file.name }));
  try {
    await request('/upload', { method: 'POST', body });
    showToast(t('media.uploaded', { name: file.name }));
    await loadMedia(state.media?.path || '');
  } catch (error) {
    showToast(error.message, true);
  } finally {
    $('uploadInput').value = '';
  }
}

function bindEvents() {
  $('languageSelect').addEventListener('change', event => setLocale(event.target.value, true));
  $$('[data-workspace-choice]').forEach(button => button.addEventListener('click', () => setWorkspace(button.dataset.workspaceChoice)));
  $('viewCurrentOutputButton').addEventListener('click', () => {
    $('currentOutputDetails').open = true;
    $('currentOutputDetails').scrollIntoView({ behavior: 'smooth', block: 'start' });
    const mode = state.status?.player?.mode || state.status?.config?.default_mode || 'dashboard';
    loadLiveOutputPreview(mode);
  });
  $('currentOutputDetails').addEventListener('toggle', () => {
    if (!$('currentOutputDetails').open) return;
    const mode = state.status?.player?.mode || state.status?.config?.default_mode || 'dashboard';
    loadLiveOutputPreview(mode);
  });
  $$('.mode-button').forEach(button => button.addEventListener('click', () => action({ action: 'mode', mode: button.dataset.mode }, t('settings.switched', { mode: modeTitle(button.dataset.mode) }))));
  $$('.transport button').forEach(button => button.addEventListener('click', () => action({ action: button.dataset.action })));
  $('progressRange').addEventListener('change', () => {
    const player = state.status?.player;
    if (!player?.duration_seconds) return;
    const target = Number($('progressRange').value) / 100 * player.duration_seconds;
    action({ action: 'seek', value: target - (player.position_seconds || 0) });
  });
  $('volumeRange').addEventListener('input', event => {
    setText('volumeValue', `${event.target.value}%`);
    clearTimeout(state.volumeTimer);
    state.volumeTimer = setTimeout(() => action({ action: 'volume', value: Number(event.target.value) }), 160);
  });
  $('playUrlButton').addEventListener('click', () => {
    const path = $('urlInput').value.trim();
    if (path) action({ action: 'play', path }, t('media.openingNetwork'));
  });
  $('urlInput').addEventListener('keydown', event => { if (event.key === 'Enter') $('playUrlButton').click(); });
  $('parentButton').addEventListener('click', () => loadMedia($('parentButton').dataset.path));
  $('refreshMediaButton').addEventListener('click', () => loadMedia(state.media?.path || ''));
  $('playDirectoryButton').addEventListener('click', () => {
    const seconds = Number($('slideshowInterval').value);
    const count = Number($('playDirectoryButton').dataset.count || 0);
    if (state.media?.path && count > 0) action({ action: 'slideshow', path: state.media.path, value: seconds }, t('media.slideshowStarted', { count, seconds }));
  });
  $('slideshowInterval').addEventListener('change', () => { state.slideshowIntervalChanged = true; });
  $('playSelectedButton').addEventListener('click', () => action({ action: 'play', paths: Array.from(state.selected) }, t('media.loaded', { count: state.selected.size })));
  $('uploadButton').addEventListener('click', () => $('uploadInput').click());
  $('uploadInput').addEventListener('change', event => upload(event.target.files?.[0]));
  $('settingsButton').addEventListener('click', openSettings);
  $('closeSettingsButton').addEventListener('click', closeSettings);
  $('cancelSettingsButton').addEventListener('click', closeSettings);
  $('settingsDialog').addEventListener('cancel', event => { event.preventDefault(); closeSettings(); });
  $('settingsForm').addEventListener('submit', saveSettings);
  $('settingsForm').addEventListener('input', updateSettingsDirty);
  $('settingsForm').addEventListener('change', updateSettingsDirty);
  ['dashboardLanguageInput', 'dashboardTitleInput', 'dashboardLayoutInput', 'fontScaleInput'].forEach(id => $(id).addEventListener('input', readDashboardControls));
  $('previewResolutionInput').addEventListener('input', scheduleDashboardPreview);
  $('resetDashboardButton').addEventListener('click', resetDashboardSettings);
  $('saveDashboardButton').addEventListener('click', () => saveDashboard(false));
  $('applyDashboardButton').addEventListener('click', () => saveDashboard(true));
  ['canvasBackgroundTypeInput', 'canvasBackgroundColorInput', 'canvasSecondaryColorInput', 'canvasBackgroundImageInput'].forEach(id => $(id).addEventListener('input', readCanvasBackgroundControls));
  $$('[data-canvas-template]').forEach(button => button.addEventListener('click', () => {
    $('canvasTemplateInput').value = button.dataset.canvasTemplate;
    applyCanvasTemplate();
  }));
  $('applyCanvasTemplateButton').addEventListener('click', applyCanvasTemplate);
  $('addCanvasWidgetButton').addEventListener('click', addCanvasWidget);
  $('removeCanvasWidgetButton').addEventListener('click', removeCanvasWidget);
  ['canvasWidgetTextInput', 'canvasWidgetSourceInput', 'canvasWidgetXInput', 'canvasWidgetYInput', 'canvasWidgetWidthInput', 'canvasWidgetHeightInput', 'canvasWidgetFontInput', 'canvasWidgetColorInput', 'canvasWidgetBoldInput'].forEach(id => $(id).addEventListener('input', updateSelectedCanvasWidget));
  $('saveCanvasButton').addEventListener('click', () => saveCanvas(false));
  $('applyCanvasButton').addEventListener('click', () => saveCanvas(true));
  $('uploadCanvasBackgroundButton').addEventListener('click', () => $('canvasBackgroundUploadInput').click());
  $('canvasBackgroundUploadInput').addEventListener('change', event => uploadCanvasBackground(event.target.files?.[0]));
  $('canvasScenePreview').addEventListener('pointerdown', beginCanvasDrag);
  $('canvasScenePreview').addEventListener('pointermove', moveCanvasDrag);
  $('canvasScenePreview').addEventListener('pointerup', endCanvasDrag);
  $('canvasScenePreview').addEventListener('pointercancel', endCanvasDrag);
  $('dshInstallButton').addEventListener('click', installDSHSkill);
  $('addRemoteSourceButton').addEventListener('click', addRemoteSource);
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  bindEvents();
  updateClock();
  setInterval(updateClock, 1000);
  refreshStatus();
  loadMedia();
  loadDSHIntegration();
});
