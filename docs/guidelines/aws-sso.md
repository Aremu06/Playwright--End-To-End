### AWS & SSO

Some tests require AWS authentication.
Therefore, you need to set up and login to your AWS account.

See > [Confluence SSO Documentation](https://fitmart-gmbh.atlassian.net/wiki/spaces/ITCloud/pages/2313584663/AWS+general+access)

You can set your profile with (for example):
```shell
awp Staging-TQGG.TestingDev
```

Before running your tests, login with:

```shell
aws-sso-util login
```
