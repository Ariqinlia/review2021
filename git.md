# git的工作流

# git命令

# 软回滚和硬回滚
（1）git checkout -- filename: 
    回滚本地工作区未暂存的改动，被丢弃的内容不可恢复。
    tips: 操作前务必要确认要回滚的改动是不再需要的
（2）git reset HEAD filename:
    回滚暂存区里的文件改动。
    tips: 一般不加“--hard”选项
（3）git reset <commit>:
    回滚到目标commit，丢弃该commit之后的提交记录，将被丢弃记录所做的改动保留在工作区中。
    tips: 1.只操作本地记录，禁止操作已push的记录
          2.慎用“--hard”选项
（4）git commit --amend:
    修改最后一次commit的内容和提交日志
    tips: 只操作本地记录，禁止操作已push的记录
（5）git revert <commit>：
    回滚相关commit所作的改动，再次提交将生成新的commit，历史记录不受影响。
    tips: 已push的内容如果要回滚只能使用revert

# git pull && git fetch

# git merge && git rebase

