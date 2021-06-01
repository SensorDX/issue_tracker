# Sensor DX - Sensor Management System (SMS)
Loading ...

Good stuff coming your way&nbsp;&nbsp;&nbsp;
[========>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;] 40 %

Awesome support
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[==>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;] 10 %

Standard coding
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[================>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;] 80 %


## Get up and running!

```ruby
npm install
node server.js
```
## Setting up email service
To enable email functionality, please create a credentials file in
```ruby
api/controllers/config
```

that looks like the following:
```ruby
{
  email: {
    user: 'account@domain.com',
    password: 'account_password',
    host: 'my_smtp_host.com',
    port: 'xxx'
  }
}
```

## Notes

This issue tracker is still in the making. While we're cooking good stuff for our beloved community, 
give our issue tracker a try and let us know how we can improve it as we're building it.

## Video Walkthrough

Here's a walkthrough of our wonderful SensorDX-SMS - more stuff will be added as we move forward :-)

<img src='https://i.imgur.com/uzMIpf8.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

## License

    Copyright 2017 Sensor DX

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.


## Deployment
Instructions for deploying new version

- Log in to IBM cloud and checked that you had access to the CloudFoundry Application.
- Checked the public URL: Had the nodeJS starter application running.
- Google “IBM Cloud CLI”: https://cloud.ibm.com/docs/cli?topic=cli-getting-started
- Follow installation of the CLI.
- Open the container in IBM Cloud and set all the environment variables.
- Once the CLI is installed, configure the correct region (Us-South for SensorDX).
- Set cloudfoundry as the target for ibmcloud cli.
- Install ibmcloud cf by running “ibmcloud cf install”. (if you arent logged in use ibmcloud login)
- Verify you can see the apps by running “ibmcloud cf apps”, you should now see the applications you have access to.
- In your terminal go to the application folder and run “ibmcloud cf push [APPNAME]”. (TahmoIssueTracker)