# SokoYetu Stage 29A: Launch Risk Register

| Risk | Impact | Control |
|---|---|---|
| M-PESA remains in sandbox | Real customers cannot pay properly | Keep testing only until production Daraja credentials are issued |
| Email forwarding not active | Customer messages may be missed | Confirm support@, orders@ and admin@ forwarding |
| Admin token leaked | Unauthorized access to admin pages | Use strong unique tokens and rotate immediately if exposed |
| Database unavailable | Orders and products cannot load | Monitor Render logs and database provider status |
| Seller not verified | Poor quality or fraudulent listings | Use seller verification dashboard and manual approval |
| Refund requests missed | Customer trust damage | Use support queue daily |
| Product images missing | Poor catalogue trust | Require seller photos or approved supplier images |
| Admin registration open | Unauthorized admin accounts | Keep ADMIN_REGISTRATION_ENABLED false |
| Production M-PESA switched too early | Failed live payments | Only switch after Safaricom production credentials are confirmed |
