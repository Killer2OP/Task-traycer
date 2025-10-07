# MongoDB Atlas Setup Guide for Task Traycer

This guide will help you set up MongoDB Atlas for your Task Traycer application.

## 🚀 Quick Setup Steps

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Verify your email address

### 2. Create a New Cluster
1. **Choose Cloud Provider**: Select AWS, Google Cloud, or Azure
2. **Choose Region**: Select a region close to your users
3. **Choose Cluster Tier**: 
   - For development: M0 (Free tier) - 512MB storage
   - For production: M2 or higher
4. **Cluster Name**: Give it a name like "task-traycer-cluster"
5. Click "Create Cluster"

### 3. Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. **Authentication Method**: Password
4. **Username**: Create a username (e.g., `task-traycer-user`)
5. **Password**: Generate a secure password (save this!)
6. **Database User Privileges**: 
   - Select "Atlas admin" for full access
   - Or "Read and write to any database" for specific access
7. Click "Add User"

### 4. Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. **For Development**: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. **For Production**: Add your specific IP addresses
5. Click "Confirm"

### 5. Get Connection String
1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string

### 6. Configure Your Application

#### Create `.env.local` file:
```bash
# Copy from env.example
cp env.example .env.local
```

#### Update `.env.local` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://task-traycer-user:your-password@task-traycer-cluster.xxxxx.mongodb.net/task-traycer?retryWrites=true&w=majority
```

**Replace:**
- `task-traycer-user` with your database username
- `your-password` with your database password
- `task-traycer-cluster.xxxxx` with your actual cluster URL
- `task-traycer` with your preferred database name

## 🔧 Connection String Breakdown

```
mongodb+srv://username:password@cluster-url/database-name?retryWrites=true&w=majority
```

- `mongodb+srv://` - Protocol for Atlas connections
- `username:password` - Your database credentials
- `cluster-url` - Your cluster's connection string
- `database-name` - Name of your database
- `retryWrites=true` - Enables retryable writes
- `w=majority` - Write concern for data consistency

## 🛠️ Testing Your Connection

### 1. Start Your Application
```bash
npm run dev
```

### 2. Check Console Logs
You should see:
```
✅ Connected to MongoDB Atlas
```

### 3. Test Database Operations
1. Go to `http://localhost:3000`
2. Create a new project
3. Check your Atlas dashboard to see the data

## 📊 Monitoring Your Database

### Atlas Dashboard Features:
- **Real-time Performance**: Monitor queries and connections
- **Database Explorer**: Browse your collections and documents
- **Indexes**: Optimize query performance
- **Alerts**: Set up notifications for issues

### Useful Atlas Tools:
1. **Data Explorer**: View and edit documents
2. **Performance Advisor**: Get optimization suggestions
3. **Real-time Performance Panel**: Monitor live metrics

## 🔒 Security Best Practices

### 1. Database User Security
- Use strong, unique passwords
- Create specific users for different applications
- Regularly rotate passwords

### 2. Network Security
- **Development**: Use 0.0.0.0/0 for easy testing
- **Production**: Whitelist specific IP addresses only
- Consider VPC peering for production

### 3. Connection Security
- Always use SSL/TLS (enabled by default in Atlas)
- Use environment variables for connection strings
- Never commit credentials to version control

## 🚨 Troubleshooting

### Common Issues:

#### 1. Connection Timeout
```
Error: Server selection timed out
```
**Solution**: Check your IP whitelist in Network Access

#### 2. Authentication Failed
```
Error: Authentication failed
```
**Solution**: Verify username/password in Database Access

#### 3. SSL/TLS Issues
```
Error: SSL handshake failed
```
**Solution**: Ensure your connection string includes `ssl=true`

#### 4. Database Not Found
```
Error: Database does not exist
```
**Solution**: Atlas creates databases automatically when you first write data

### Debug Steps:
1. Check your `.env.local` file
2. Verify Atlas cluster is running
3. Check Network Access settings
4. Verify Database User permissions
5. Test connection string in Atlas Compass

## 📈 Scaling Your Database

### Free Tier Limitations:
- 512MB storage
- Shared RAM
- No dedicated resources

### Upgrade Options:
- **M2**: $9/month - 2GB storage, shared RAM
- **M5**: $25/month - 5GB storage, shared RAM
- **M10**: $57/month - 10GB storage, dedicated RAM

### When to Upgrade:
- Approaching storage limits
- Performance issues
- Need for dedicated resources
- Production deployment

## 🔄 Backup and Recovery

### Atlas Automatic Backups:
- **M2+**: Continuous backups
- **M0**: Manual snapshots only

### Backup Options:
1. **Continuous Backups**: Point-in-time recovery
2. **Cloud Provider Snapshots**: Full cluster snapshots
3. **Export/Import**: Manual data export

## 📞 Support Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [Atlas Community Forum](https://community.atlas.mongodb.com/)
- [Atlas Support](https://support.mongodb.com/)

## ✅ Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created with proper permissions
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] `.env.local` file configured
- [ ] Application tested and connected
- [ ] Data operations working
- [ ] Monitoring set up

Your Task Traycer application is now ready to use MongoDB Atlas! 🎉
