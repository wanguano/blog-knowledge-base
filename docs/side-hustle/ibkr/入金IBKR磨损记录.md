---
title: 入金 IBKR 磨损记录
description: 记录 Bybit Card 与 Bitget Wallet Card 入金到 IBKR 的实际磨损与操作路径
date: 2026-03-03
tags: [副业, IBKR, 入金, 加密货币]
---

# {{ $frontmatter.title }}

::: tip 分类
副业 / IBKR / 入金 / 加密货币
:::

## 核心结论

- **Bybit Card 路线实测磨损约 1.18% - 1.19%**（100 美元与 500 美元样本接近）
- **Bitget Wallet Card 路线主要成本为链上 Gas + IBKR 换汇点差**
- 如果追求确定性，当前可先按 **Bitget Wallet（欧意提币） -> Card 欧元余额 -> IBKR** 作为主方案持续记录

## 分类内容（按场景）

| 分类 | 路线 | 主要成本构成 | 当前结论 | 适用场景 |
| :--- | :--- | :--- | :--- | :--- |
| 稳定费率路线 | Bybit Card 入金 | Bybit 侧手续费 + 换汇损耗 | 实测约 1.18% - 1.19% | 追求费率可预期、操作步骤固定 |
| 低磨损潜力路线 | Bitget Wallet Card 入金 | 链上 Gas + IBKR 换汇点差 | 理论上可更优，需更多样本验证 | 接受链路操作、愿意持续优化磨损 |

---

## Bybit Card 入金实测

### 操作路径

`USDC/USDT -> 充值 Bybit -> 转换 EUR -> 入金 IBKR`

### 实测数据

| 入金金额 | 手续费 | 磨损率 |
| :---: | :---: | :---: |
| 100 美元 | 1.09 EUR | 1.18% |
| 500 美元 | 5.49 EUR | 1.186% |

### 截图记录

![Bybit 100 美元](https://mingcloudpic.oss-cn-beijing.aliyuncs.com/images/202603032219349.png)

![Bybit 500 美元](https://mingcloudpic.oss-cn-beijing.aliyuncs.com/images/202603032219350.png)

---

## Bitget Wallet Card 入金

### 操作路径（推荐：欧意提现）

`USDC (ARB 链) -> Bitget Wallet -> 充值到 Card 欧元余额 -> 汇款到 IBKR`

### 成本说明

- 主要磨损来自：**链上 Gas + IBKR 换汇**
- 暂无固定费率结论，建议继续补充不同金额样本

### 汇款截图

![Bitget Wallet 汇款到 IBKR](https://mingcloudpic.oss-cn-beijing.aliyuncs.com/images/202603032219351.png)

---

## 后续记录建议

- 每次记录统一填写：金额、链路、手续费、到账金额、总磨损率
- 至少补充 3 个金额档位（如 200 / 1000 / 2000 美元），再做最终路线结论