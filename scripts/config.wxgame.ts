/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, EmitResConfigFilePlugin, TextureMergerPlugin, CleanPlugin, ResSplitPlugin } from 'built-in';
import { WxgamePlugin } from './wxgame/wxgame';
import { SubPackagePlugin } from './wxgame/subpackage';
import { CustomPlugin } from './myplugin';
import * as defaultConfig from './config';

const config: ResourceManagerConfig = {

    buildConfig: (params) => {

        const { target, command, projectName, version } = params;
        const outputDir = `../${projectName}_wxgame`;
        if (command == 'build') {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["js", "resource", "stage1"] }),
                    new CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new WxgamePlugin(),
                    new ManifestPlugin({ output: 'manifest.js' })
                    // new SubPackagePlugin({
                    //     output: 'manifest.js',
                    //     subPackages: [
                    //         {
                    //             root: "stage1",
                    //             "includes": [
                    //                 "main.js"
                    //             ]
                    //         }
                    //     ]
                    // })
                ]
            }
        }
        else if (command == 'publish') {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["js", "resource", "stage1"] }),
                    new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new WxgamePlugin(),
                    new UglifyPlugin([
                        {//游戏代码
                            sources: ["main.js"],
                            target: "main.min.js"
                        },
                        {//游戏皮肤
                            sources: ["resource/default.thm.js"],
                            target: "default.thm.min.js"
                        },
                        {//登录
                            sources: [
                                "resource/login.thm.js",
                                "lib-login/login.min.js",
                                ],
                            target: "main-login.min.js"
                        },
                        {// 库
                            sources: [
                                "libs/modules/egret/egret.min.js",
                                "libs/modules/eui/eui.min.js",
                                "libs/modules/assetsmanager/assetsmanager.min.js",
                                "libs/modules/tween/tween.min.js",
                                "libs/modules/game/game.min.js",
                                "libs/modules/socket/socket.min.js",
                                "libs/bin/md5/md5.min.js",
                                "libs/bin/mobile-detect/mobile-detect.min.js"
                            ],
                            target: "libs.min.js"
                        },
                        // {// 其他库
                        //     sources: [
                        //         "libs/bin/md5/md5.min.js",
                        //         "libs/bin/mobile-detect/mobile-detect.min.js"
                        //     ],
                        //     // 压缩后的文件
                        //     target: "other.libs.min.js"
                        // }
                    ]),
                    new ResSplitPlugin({
                        matchers:[
                            {from:'resource/**',to:`../${projectName}_resource_remote`}
                        ]
                    }),
                    new ManifestPlugin({ output: 'manifest.js' })
                    // new SubPackagePlugin({
                    //     output: 'manifest.js',
                    //     subPackages: [
                    //         {
                    //             root: "stage1",
                    //             "includes": [
                    //                 "libs/modules/egret/egret.min.js",
                    //                 "libs/modules/egret/egret.web.min.js",
                    //                 "libs/modules/assetsmanager/assetsmanager.min.js",
                    //                 "libs/modules/tween/tween.min.js",
                    //                 "libs/modules/game/game.min.js",
                    //                 "libs/modules/promise/promise.min.js",
                    //                 "libs/modules/eui/eui.min.js",
                    //                 "libs/modules/socket/socket.min.js",
                    //             ]
                    //         }
                    //     ]
                    // })
                ]
            }
        }
        else {
            throw `unknown command : ${params.command}`;
        }
    },

    mergeSelector: defaultConfig.mergeSelector,

    typeSelector: defaultConfig.typeSelector
}



export = config;
