/*
Copyright 2016 OpenMarket Ltd
Copyright 2017 Travis Ralston

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const React = require('react');
const sdk = require("../../../index");
import { _t, _td } from '../../../languageHandler';
import SettingsStore, {SettingLevel} from "../../../settings/SettingsStore";


module.exports = React.createClass({
    displayName: 'UrlPreviewSettings',

    propTypes: {
        room: React.PropTypes.object,
    },

    saveSettings: function() {
        const promises = [];
        if (this.refs.urlPreviewsRoom) promises.push(this.refs.urlPreviewsRoom.save());
        if (this.refs.urlPrviewsSelf) promises.push(this.refs.urlPreviewsSelf.save());
        return promises;
    },

    render: function() {
        const SettingsFlag = sdk.getComponent("elements.SettingsFlag");
        const roomId = this.props.room.roomId;

        let previewsForAccount = null;
        if (SettingsStore.getValueAt(SettingLevel.ACCOUNT, "urlPreviewsEnabled")) {
            previewsForAccount = (
                _t("You have <a>enabled</a> URL previews by default.", {}, { 'a': (sub)=><a href="#/settings">{ sub }</a> })
            );
        } else {
            previewsForAccount = (
                _t("You have <a>disabled</a> URL previews by default.", {}, { 'a': (sub)=><a href="#/settings">{ sub }</a> })
            );
        }

        let previewsForRoom = null;
        if (SettingsStore.canSetValue("urlPreviewsEnabled", roomId, "room")) {
            previewsForRoom = (
                <label>
                    <SettingsFlag name="urlPreviewsEnabled"
                                  level={SettingLevel.ROOM}
                                  roomId={this.props.room.roomId}
                                  isExplicit={true}
                                  manualSave={true}
                                  ref="urlPreviewsRoom" />
                </label>
            );
        } else {
            let str = _td("URL previews are enabled by default for participants in this room.");
            if (!SettingsStore.getValueAt(SettingLevel.ROOM, "urlPreviewsEnabled")) {
                str = _td("URL previews are disabled by default for participants in this room.");
            }
            previewsForRoom = (<label>{ _t(str) }</label>);
        }

        const previewsForRoomAccount = (
            <SettingsFlag name="urlPreviewsEnabled"
                          level={SettingLevel.ROOM_ACCOUNT}
                          roomId={this.props.room.roomId}
                          manualSave={true}
                          ref="urlPreviewsSelf"
            />
        );

        return (
            <div className="mx_RoomSettings_toggles">
                <h3>{ _t("URL Previews") }</h3>

                <label>{ previewsForAccount }</label>
                { previewsForRoom }
                <label>{ previewsForRoomAccount }</label>
            </div>
        );
    },
});
