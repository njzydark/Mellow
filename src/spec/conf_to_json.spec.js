const convert = require('@mellow/config/convert')

const conf = `
[Endpoint]
; tag, parser, parser-specific params...
Direct, builtin, freedom, domainStrategy=UseIP
Reject, builtin, blackhole
Dns-Out, builtin, dns
Http-Out, builtin, http, address=192.168.100.1, port=1087, user=myuser, pass=mypass
Socks-Out, builtin, socks, address=127.0.0.1, port=1080, user=myuser, pass=mypass
Proxy-1, vmess1, vmess1://75da2e14-4d08-480b-b3cb-0079a0c51275@example.com:443/v2?network=ws&tls=true#WSS+Outbound
Proxy-2, vmess1, vmess1://75da2e14-4d08-480b-b3cb-0079a0c51275@example.com:10025?network=tcp#TCP+Outbound
Proxy-3, ss, ss://YWVzLTEyOC1nY206dGVzdA==@192.168.100.1:8888
Proxy-4, ss, ss://aes-128-gcm:pass@192.168.100.1:8888
Proxy-5, vmess1, vmess1://75da2e14-4d08-480b-b3cb-0079a0c51275@example.com:443/h2?network=http&http.host=example.com%2Cexample1.com&tls=true&tls.allowinsecure=true
Proxy-6, vmess1, vmess1://75da2e14-4d08-480b-b3cb-0079a0c51275@example.com:443/v2?network=ws&tls=true&ws.host=example.com

[EndpointGroup]
; tag, colon-seperated list of selectors or endpoint tags, strategy, strategy-specific params...
MyGroup, Proxy-1:Proxy-2:Proxy-3, latency, interval=300, timeout=6

[Routing]
domainStrategy = IPIfNonMatch

[RoutingRule]
; type, filter, endpoint tag or enpoint group tag
DOMAIN-KEYWORD, geosite:category-ads-all, Reject
IP-CIDR, 8.8.8.8/32, MyGroup
GEOIP, cn, Direct
GEOIP, private, Direct
PORT, 123, Direct
DOMAIN-FULL, a.google.com, MyGroup
DOMAIN, b.google.com, MyGroup
DOMAIN-SUFFIX, c.google.com, MyGroup
DOMAIN-KEYWORD, geosite:cn, Direct
DOMAIN-KEYWORD, bilibili, Direct
PROCESS-NAME, git, Proxy-2
FINAL, Direct

[Dns]
; hijack = dns endpoint tag
hijack = Dns-Out
clientIp = 114.114.114.114

[DnsServer]
; address, port, tag
223.5.5.5
8.8.8.8, 53, Remote
8.8.4.4

[DnsRule]
; type, filter, dns server tag
DOMAIN-KEYWORD, geosite:geolocation-!cn, Remote
DOMAIN, www.google.com, Remote
DOMAIN-FULL, www.twitter.com, Remote
DOMAIN-SUFFIX, google.com, Remote

[DnsHost]
; domain = ip
localhost = 127.0.0.1

[Log]
loglevel = warning
`

const json = `
{
  "log": {
    "loglevel": "warning"
  },
  "outbounds": [
    {
      "tag": "Direct",
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIP"
      }
    },
    {
      "tag": "Reject",
      "protocol": "blackhole"
    },
    {
      "tag": "Dns-Out",
      "protocol": "dns",
      "settings": {}
    },
    {
      "tag": "Http-Out",
      "protocol": "http",
      "settings": {
        "servers": [
          {
            "address": "192.168.100.1",
            "port": 1087,
            "users": [
              {
                "user": "myuser",
                "pass": "mypass"
              }
            ]
          }
        ]
      }
    },
    {
      "tag": "Socks-Out",
      "protocol": "socks",
      "settings": {
        "servers": [
          {
            "address": "127.0.0.1",
            "port": 1080,
            "users": [
              {
                "user": "myuser",
                "pass": "mypass"
              }
            ]
          }
        ]
      }
    },
    {
      "tag": "Proxy-1",
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "users": [
              {
                "id": "75da2e14-4d08-480b-b3cb-0079a0c51275"
              }
            ],
            "address": "example.com",
            "port": 443
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "security": "tls",
        "wsSettings": {
          "path": "\/v2"
        }
      }
    },
    {
      "tag": "Proxy-2",
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "users": [
              {
                "id": "75da2e14-4d08-480b-b3cb-0079a0c51275"
              }
            ],
            "address": "example.com",
            "port": 10025
          }
        ]
      },
      "streamSettings": {
        "network": "tcp"
      }
    },
    {
      "tag": "Proxy-3",
      "protocol": "shadowsocks",
      "settings": {
        "servers": [
          {
            "method": "aes-128-gcm",
            "password": "test",
            "address": "192.168.100.1",
            "port": 8888
          }
        ]
      }
    },
    {
      "tag": "Proxy-4",
      "protocol": "shadowsocks",
      "settings": {
        "servers": [
          {
            "method": "aes-128-gcm",
            "password": "pass",
            "address": "192.168.100.1",
            "port": 8888
          }
        ]
      }
    },
    {
      "tag": "Proxy-5",
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "users": [
              {
                "id": "75da2e14-4d08-480b-b3cb-0079a0c51275"
              }
            ],
            "address": "example.com",
            "port": 443
          }
        ]
      },
      "streamSettings": {
        "network": "http",
        "security": "tls",
        "tlsSettings": {
          "allowInsecure": true
        },
        "httpSettings": {
          "path": "/h2",
          "host": [
            "example.com",
            "example1.com"
          ]
        }
      }
    },
    {
      "tag": "Proxy-6",
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "users": [
              {
                "id": "75da2e14-4d08-480b-b3cb-0079a0c51275"
              }
            ],
            "address": "example.com",
            "port": 443
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "security": "tls",
        "wsSettings": {
          "path": "\/v2",
          "headers": {
            "Host": "example.com"
          }
        }
      }
    }
  ],
  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "balancers": [
      {
        "tag": "MyGroup",
        "selector": [
          "Proxy-1",
          "Proxy-2",
          "Proxy-3"
        ],
        "strategy": "latency",
        "interval": 300,
        "timeout": 6
      }
    ],
    "rules": [
      {
        "inboundTag": ["tun2socks"],
        "network": "udp",
        "port": 53,
        "outboundTag": "Dns-Out",
        "type": "field"
      },
      {
        "type": "field",
        "domain": [
          "geosite:category-ads-all"
        ],
        "outboundTag": "Reject"
      },
      {
        "type": "field",
        "ip": [
          "8.8.8.8\/32"
        ],
        "balancerTag": "MyGroup"
      },
      {
        "type": "field",
        "ip": [
          "geoip:cn",
          "geoip:private"
        ],
        "outboundTag": "Direct"
      },
      {
        "type": "field",
        "port": "123",
        "outboundTag": "Direct"
      },
      {
        "type": "field",
        "domain": [
          "full:a.google.com",
          "full:b.google.com",
          "domain:c.google.com"
        ],
        "balancerTag": "MyGroup"
      },
      {
        "type": "field",
        "domain": [
          "geosite:cn",
          "bilibili"
        ],
        "outboundTag": "Direct"
      },
      {
        "type": "field",
        "app": [
          "git"
        ],
        "outboundTag": "Proxy-2"
      },
      {
        "type": "field",
        "ip": [
          "0.0.0.0\/0",
          "::\/0"
        ],
        "outboundTag": "Direct"
      }
    ]
  },
  "dns": {
    "servers": [
      "223.5.5.5",
      {
        "address": "8.8.8.8",
        "port": 53,
        "domains": [
          "geosite:geolocation-!cn",
          "full:www.google.com",
          "full:www.twitter.com",
          "domain:google.com"
        ]
      },
      "8.8.4.4"
    ],
    "hosts": {
      "localhost": "127.0.0.1"
    },
    "clientIp": "114.114.114.114"
  }
}
`

describe('Convert conf config to JSON', () => {
  test('Get lines by section', () => {
    const lines = convert.getLinesBySection(conf, 'DnsServer')
    const expectedLines = [
      '223.5.5.5',
      '8.8.8.8, 53, Remote',
      '8.8.4.4'
    ]
    expect(lines).toEqual(expectedLines)
  })

  test('Construct routing object', () => {
    const routingDomainStrategy = convert.getLinesBySection(conf, 'RoutingDomainStrategy')
    const routingConf = convert.getLinesBySection(conf, 'Routing')
    const balancerRule = convert.getLinesBySection(conf, 'EndpointGroup')
    const routingRule = convert.getLinesBySection(conf, 'RoutingRule')
    const dnsConf = convert.getLinesBySection(conf, 'Dns')
    const routing = convert.constructRouting(routingConf, routingDomainStrategy, balancerRule, routingRule, dnsConf)
    expect(routing).toEqual(JSON.parse(json).routing)
  })

  test('Construct dns object', () => {
    const dnsConf = convert.getLinesBySection(conf, 'Dns')
    const dnsServer = convert.getLinesBySection(conf, 'DnsServer')
    const dnsRule = convert.getLinesBySection(conf, 'DnsRule')
    const dnsHost = convert.getLinesBySection(conf, 'DnsHost')
    const dnsClientIp = convert.getLinesBySection(conf, 'DnsClientIp')
    const dns = convert.constructDns(dnsConf, dnsServer, dnsRule, dnsHost, dnsClientIp)
    expect(dns).toEqual(JSON.parse(json).dns)
  })

  test('Construct log object', () => {
    const logLines = convert.getLinesBySection(conf, 'Log')
    const log = convert.constructLog(logLines)
    expect(log).toEqual(JSON.parse(json).log)
  })

  test('Construct outbounds object', () => {
    const endpoint = convert.getLinesBySection(conf, 'Endpoint')
    const outbounds = convert.constructOutbounds(endpoint)
    expect(outbounds).toEqual(JSON.parse(json).outbounds)
  })

  test('Construct the whole JSON object', () => {
    const v2json = convert.constructJson(conf)
    expect(v2json).toEqual(JSON.parse(json))
  })
})
